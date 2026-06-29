import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SolarHeader from '@/components/SolarHeader';
import { ArrowLeft, Download, FileText, FileSpreadsheet, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface LogEntry {
  id: number;
  timestamp: string;
  date: Date;
  power: string;
  load: string;
  voltage: string;
  current: string;
  battery: string;
}

// Generate realistic mock data for demonstrations
const generateMockLogs = (): LogEntry[] => {
  const logs: LogEntry[] = [];
  const now = new Date();
  
  let currentVolt = 27.8;
  let currentAmp = 3.6;
  let batteryCap = 78;
  let currentLoad = 65.2;

  for (let i = 0; i < 200; i++) {
    const d = new Date(now.getTime() - i * 15 * 60 * 1000); // every 15 minutes
    
    currentVolt = Math.max(22, Math.min(29, currentVolt + (Math.random() * 0.4 - 0.2)));
    currentAmp = Math.max(0.5, Math.min(10, currentAmp + (Math.random() * 0.4 - 0.2)));
    currentLoad = Math.max(10, Math.min(150, currentLoad + (Math.random() * 10 - 5)));
    
    const power = (currentVolt * currentAmp).toFixed(1);
    const load = currentLoad.toFixed(1);
    batteryCap = Math.max(10, Math.min(100, batteryCap + (Math.random() * 0.6 - 0.3)));

    logs.push({
      id: i,
      timestamp: `${d.toLocaleDateString('id-ID')} ${d.toLocaleTimeString('id-ID')}`,
      date: d,
      power: power + " W",
      load: load + " W",
      voltage: currentVolt.toFixed(1) + " V",
      current: currentAmp.toFixed(1) + " A",
      battery: Math.round(batteryCap) + " %"
    });
  }
  return logs;
};

const mockLogs = generateMockLogs();

const Logs = () => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'daily' | 'weekly' | 'yearly'>('daily');
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  const toggleDay = (dayStr: string) => {
    setExpandedDays(prev => ({ ...prev, [dayStr]: !prev[dayStr] }));
  };

  const filteredLogs = useMemo(() => {
    let result = mockLogs;
    const now = new Date();

    if (timeFilter !== 'all') {
      result = result.filter(log => {
        const diffTime = Math.abs(now.getTime() - log.date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (timeFilter === 'daily') return diffDays <= 1;
        if (timeFilter === 'weekly') return diffDays <= 7;
        if (timeFilter === 'yearly') return diffDays <= 365;
        return true;
      });
    }

    return result;
  }, [timeFilter]);

  const groupedLogs = useMemo(() => {
    if (timeFilter === 'daily') return null;

    const groups: Record<string, LogEntry[]> = {};
    filteredLogs.forEach(log => {
      const dayStr = log.date.toLocaleDateString('id-ID');
      if (!groups[dayStr]) groups[dayStr] = [];
      groups[dayStr].push(log);
    });
    return Object.entries(groups).map(([date, logs]) => ({ date, logs }));
  }, [filteredLogs, timeFilter]);

  const calculateAverages = (logs: LogEntry[]) => {
    let totalPower = 0;
    let totalLoad = 0;
    let totalVoltage = 0;
    let totalCurrent = 0;
    let totalBattery = 0;
    logs.forEach(l => {
      totalPower += parseFloat(l.power);
      totalLoad += parseFloat(l.load);
      totalVoltage += parseFloat(l.voltage);
      totalCurrent += parseFloat(l.current);
      totalBattery += parseFloat(l.battery);
    });
    const count = logs.length || 1;
    return {
      power: (totalPower / count).toFixed(1) + " W",
      load: (totalLoad / count).toFixed(1) + " W",
      voltage: (totalVoltage / count).toFixed(1) + " V",
      current: (totalCurrent / count).toFixed(1) + " A",
      battery: Math.round(totalBattery / count) + " %"
    };
  };

  const exportToExcel = async () => {
    const wb = new ExcelJS.Workbook();
    wb.creator = "Solar Dashboard";
    wb.created = new Date();

    const ws = wb.addWorksheet("System Logs", {
      pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1 },
      views: [{ showGridLines: false }],
    });

    ws.columns = [
      { key: "A", width: 2  },
      { key: "B", width: 20 },
      { key: "C", width: 14 },
      { key: "D", width: 24 },
      { key: "E", width: 16 },
      { key: "F", width: 16 },
      { key: "G", width: 16 },
      { key: "H", width: 16 },
      { key: "I", width: 16 },
      { key: "J", width: 2  },
    ];

    const NAVY      = "FF0D2137";
    const TEAL      = "FF0A7A6E";
    const GOLD      = "FFFFC107";
    const WHITE     = "FFFFFFFF";
    const MUTED     = "FFB0BEC5";
    const HEADER_BG = "FF0D4F4A";
    const ROW_ODD   = "FFF7FDFC";
    const ROW_EVEN  = "FFDFF2F0";
    const BORDER_C  = "FFBBD8D5";

    const thin: Partial<ExcelJS.Border>  = { style: "thin",   color: { argb: BORDER_C } };
    const thick: Partial<ExcelJS.Border> = { style: "medium", color: { argb: TEAL } };
    const fullBorder = { top: thin, bottom: thin, left: thin, right: thin };

    ws.getRow(1).height = 10;
    ws.getRow(2).height = 10;
    ws.getRow(3).height = 34;
    ws.getRow(4).height = 22;
    ws.getRow(5).height = 8;
    ws.getRow(6).height = 16;

    const logoH = 90;
    const logoW = Math.round(logoH * 1480 / 551);
    try {
      const imgResp = await fetch("/lovable-uploads/7b1140d8-b2c5-4b3c-89da-49cd5e78467f.png");
      const imgBuf  = await imgResp.arrayBuffer();
      const imgId   = wb.addImage({ buffer: imgBuf, extension: "png" });
      ws.addImage(imgId, {
        tl: { col: 1.1, row: 1.4 },
        ext: { width: logoW, height: logoH },
        editAs: "oneCell",
      });
    } catch (_) { }

    const titleCell = ws.getCell("D3");
    titleCell.value = "SOLAR SYSTEM";
    titleCell.font  = { name: "Calibri", size: 20, bold: true, color: { argb: NAVY } };
    titleCell.alignment = { vertical: "middle", horizontal: "left" };
    ws.mergeCells("D3:I3");

    const subtitleCell = ws.getCell("D4");
    subtitleCell.value = "System Logs Report";
    subtitleCell.font  = { name: "Calibri", size: 13, italic: true, color: { argb: TEAL } };
    subtitleCell.alignment = { vertical: "middle", horizontal: "left" };
    ws.mergeCells("D4:I4");

    ["D5","E5","F5","G5","H5","I5"].forEach(a => {
      ws.getCell(a).fill = { type: "pattern", pattern: "solid", fgColor: { argb: TEAL } };
    });

    ws.getRow(7).height = 22;
    const metaBg: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
    const generatedAt = new Date().toLocaleString("id-ID", { dateStyle: "long", timeStyle: "medium" });
    ["A7","B7","C7","D7","E7","F7","G7","H7","I7","J7"].forEach(a => { ws.getCell(a).fill = metaBg; });
    ws.mergeCells("B7:E7");
    ws.mergeCells("F7:I7");

    const metaL = ws.getCell("B7");
    metaL.value = `  Digenerate: ${generatedAt}`;
    metaL.font  = { name: "Calibri", size: 10, italic: true, color: { argb: MUTED } };
    metaL.alignment = { vertical: "middle", horizontal: "left" };

    const metaR = ws.getCell("F7");
    metaR.value = `Total Records: ${filteredLogs.length}  `;
    metaR.font  = { name: "Calibri", size: 10, bold: true, color: { argb: GOLD } };
    metaR.alignment = { vertical: "middle", horizontal: "right" };

    ws.getRow(8).height = 8;
    ws.getRow(9).height = 56;
    const avg = calculateAverages(filteredLogs);

    // Stats: B+C merged (Timestamp width) = Avg Daya, then D E F G H = remaining 4 stats
    ws.mergeCells("B9:C9");
    [
      { col: "B", label: "Avg Daya",     value: avg.power,   bg: "FFD4EFDF", fg: "FF1B7A44", accent: "FF2ECC71" },
      { col: "D", label: "Avg Beban",    value: avg.load,    bg: "FFFFE0B2", fg: "FFE67E22", accent: "FFF39C12" },
      { col: "E", label: "Avg Tegangan", value: avg.voltage, bg: "FFD6EAF8", fg: "FF1A5276", accent: "FF3498DB" },
      { col: "F", label: "Avg Arus",     value: avg.current, bg: "FFFFF3CD", fg: "FF7D5A00", accent: "FFF39C12" },
      { col: "G", label: "Avg Baterai",  value: avg.battery, bg: "FFE8D5F5", fg: "FF6B21A8", accent: "FF9333EA" },
    ].forEach(s => {
      const c = ws.getCell(`${s.col}9`);
      c.value = `${s.label}\n${s.value}`;
      c.font  = { name: "Calibri", size: 12, bold: true, color: { argb: s.fg } };
      c.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: s.bg } };
      c.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      c.border = { top: { style: "medium", color: { argb: s.accent } }, bottom: thin, left: thin, right: thin };
    });
    // H9 fill neutral to avoid blank
    const cH9 = ws.getCell("H9");
    cH9.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F7F6" } };
    cH9.border = { top: thin, bottom: thin, left: thin, right: thin };

    ws.getRow(10).height = 8;
    ws.getRow(11).height = 28;

    // Table header: B+C merged = Timestamp, D E F G H = metric cols
    ws.mergeCells("B11:C11");
    [
      { col: "B", label: "  📅  Waktu (Timestamp)"  },
      { col: "D", label: "  ⚡  Daya (Power)"        },
      { col: "E", label: "  🏠  Beban (Load)"         },
      { col: "F", label: "  ⚡  Tegangan (Voltage)"   },
      { col: "G", label: "  ⚡  Arus (Current)"       },
      { col: "H", label: "  🔋  Baterai (Battery)"    },
    ].forEach(({ col, label }) => {
      const c = ws.getCell(`${col}11`);
      c.value = label;
      c.font  = { name: "Calibri", size: 11, bold: true, color: { argb: WHITE } };
      c.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_BG } };
      c.alignment = { vertical: "middle", horizontal: "left" };
      c.border = { top: thick, bottom: thick, left: thin, right: thin };
    });

    filteredLogs.forEach((log, i) => {
      const rowNum = i + 12;
      const rowBg  = i % 2 === 0 ? ROW_ODD : ROW_EVEN;
      ws.getRow(rowNum).height = 20;

      // Timestamp: B+C merged — no gap on left
      ws.mergeCells(`B${rowNum}:C${rowNum}`);
      const cBC = ws.getCell(`B${rowNum}`);
      cBC.value = `  ${log.timestamp}`;
      cBC.font  = { name: "Calibri", size: 10, color: { argb: "FF2D3A45" } };
      cBC.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: rowBg } };
      cBC.alignment = { vertical: "middle", horizontal: "left" };
      cBC.border = fullBorder;

      const cD = ws.getCell(`D${rowNum}`);
      cD.value = `  ${log.power}`;
      cD.font  = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0A7A6E" } };
      cD.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: rowBg } };
      cD.alignment = { vertical: "middle", horizontal: "right" };
      cD.border = fullBorder;

      const cE = ws.getCell(`E${rowNum}`);
      cE.value = `  ${log.load}`;
      cE.font  = { name: "Calibri", size: 10, bold: true, color: { argb: "FFE67E22" } };
      cE.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: rowBg } };
      cE.alignment = { vertical: "middle", horizontal: "right" };
      cE.border = fullBorder;

      const cF = ws.getCell(`F${rowNum}`);
      cF.value = `  ${log.voltage}`;
      cF.font  = { name: "Calibri", size: 10, bold: true, color: { argb: "FF1A5276" } };
      cF.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: rowBg } };
      cF.alignment = { vertical: "middle", horizontal: "right" };
      cF.border = fullBorder;

      const cG = ws.getCell(`G${rowNum}`);
      cG.value = `  ${log.current}`;
      cG.font  = { name: "Calibri", size: 10, bold: true, color: { argb: "FF7D5A00" } };
      cG.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: rowBg } };
      cG.alignment = { vertical: "middle", horizontal: "right" };
      cG.border = fullBorder;

      const cH = ws.getCell(`H${rowNum}`);
      cH.value = `  ${log.battery}`;
      cH.font  = { name: "Calibri", size: 10, bold: true, color: { argb: "FF6B21A8" } };
      cH.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: rowBg } };
      cH.alignment = { vertical: "middle", horizontal: "right" };
      cH.border = fullBorder;
    });

    const footerRow = filteredLogs.length + 12;
    ws.getRow(footerRow).height = 18;
    ws.mergeCells(`B${footerRow}:H${footerRow}`);
    const fc = ws.getCell(`B${footerRow}`);
    fc.value = `  Solar Dashboard  •  Auto-generated report  •  ${new Date().getFullYear()}`;
    fc.font  = { name: "Calibri", size: 9, italic: true, color: { argb: WHITE } };
    fc.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
    fc.alignment = { vertical: "middle", horizontal: "center" };

    const buf  = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `Solar_Dashboard_Logs_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const exportToPDF = async () => {
    const doc  = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const W    = doc.internal.pageSize.getWidth();   // 297mm
    const H    = doc.internal.pageSize.getHeight();  // 210mm
    const m    = 10;                                  // margin
    const cW   = W - m * 2;                           // 277mm

    // ── Palette ────────────────────────────────────────────────────────────
    const NAVY   : [number,number,number] = [13,  33,  55];
    const TEAL   : [number,number,number] = [10, 122, 110];
    const WHITE  : [number,number,number] = [255,255,255];
    const MUTED  : [number,number,number] = [176,190,197];
    const GOLD   : [number,number,number] = [255,193,  7];

    let y = m;

    // ── HEADER BLOCK (logo kiri, title kanan) ──────────────────────────────
    const hdrH = 30;
    doc.setFillColor(...WHITE);
    doc.rect(m, y, cW, hdrH, "F");

    let logoLoaded = false;
    try {
      const resp = await fetch("/lovable-uploads/7b1140d8-b2c5-4b3c-89da-49cd5e78467f.png");
      const blob = await resp.blob();
      const dataUrl: string = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload  = () => res(r.result as string);
        r.onerror = rej;
        r.readAsDataURL(blob);
      });
      const lH = 22, lW = +(lH * 1480 / 551).toFixed(1); // preserve ratio
      doc.addImage(dataUrl, "PNG", m + 1, y + 4, lW, lH);
      logoLoaded = true;
    } catch (_) {}

    const titleX = logoLoaded ? m + 64 : m + 2;
    doc.setFont("helvetica", "bold");   doc.setFontSize(20);
    doc.setTextColor(...NAVY);
    doc.text("SOLAR SYSTEM", titleX, y + 12);
    doc.setFont("helvetica", "italic"); doc.setFontSize(11);
    doc.setTextColor(...TEAL);
    doc.text("System Logs Report", titleX, y + 20);
    // Teal accent line
    doc.setFillColor(...TEAL);
    doc.rect(titleX, y + 22, cW - (titleX - m), 1.2, "F");

    y += hdrH + 2;

    // ── META BAND ──────────────────────────────────────────────────────────
    doc.setFillColor(...NAVY);
    doc.rect(m, y, cW, 8, "F");
    const genAt = new Date().toLocaleString("id-ID", { dateStyle: "long", timeStyle: "medium" });
    doc.setFont("helvetica", "italic"); doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(`  Digenerate: ${genAt}`, m + 2, y + 5.4);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GOLD);
    doc.text(`Total Records: ${filteredLogs.length}`, W - m - 2, y + 5.4, { align: "right" });
    y += 11;

    // ── STATS CARDS (5 cards, full width) ──────────────────────────────────
    const avg    = calculateAverages(filteredLogs);
    const crdH   = 18;
    const cards  = [
      { label: "Avg Daya",     val: avg.power,   bg: [212,239,223] as [number,number,number], fg: [27,122,68]   as [number,number,number], ac: [46,204,113]  as [number,number,number] },
      { label: "Avg Beban",    val: avg.load,    bg: [255,224,178] as [number,number,number], fg: [180,100,  0] as [number,number,number], ac: [243,156, 18] as [number,number,number] },
      { label: "Avg Tegangan", val: avg.voltage, bg: [214,234,248] as [number,number,number], fg: [26, 82,118]  as [number,number,number], ac: [52,152,219]  as [number,number,number] },
      { label: "Avg Arus",     val: avg.current, bg: [255,243,205] as [number,number,number], fg: [125, 90,  0] as [number,number,number], ac: [243,156, 18] as [number,number,number] },
      { label: "Avg Baterai",  val: avg.battery, bg: [232,213,245] as [number,number,number], fg: [107, 33,168] as [number,number,number], ac: [147, 51,234] as [number,number,number] },
    ];
    const crdW = cW / cards.length;
    cards.forEach((c, i) => {
      const cx = m + i * crdW;
      doc.setFillColor(...c.bg);
      doc.rect(cx, y, crdW, crdH, "F");
      doc.setFillColor(...c.ac);
      doc.rect(cx, y, crdW, 1.5, "F");
      doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      doc.setTextColor(...c.fg);
      doc.text(c.label, cx + crdW / 2, y + 7.5, { align: "center" });
      doc.setFont("helvetica", "bold");   doc.setFontSize(12);
      doc.text(c.val,   cx + crdW / 2, y + 14.5, { align: "center" });
    });
    y += crdH + 3;

    // ── DATA TABLE (full width via autoTable) ──────────────────────────────
    // Col widths must sum to cW = 277mm
    // Timestamp needs more space; the 5 metric cols share the rest equally
    const tsW   = 55;
    const metW  = +((cW - tsW) / 5).toFixed(1);
    const lastW = +(cW - tsW - metW * 4).toFixed(1); // absorb rounding in last col

    autoTable(doc, {
      head: [["Waktu (Timestamp)", "Daya (Power)", "Beban (Load)", "Tegangan (Voltage)", "Arus (Current)", "Baterai (Battery)"]],
      body: filteredLogs.map(l => [l.timestamp, l.power, l.load, l.voltage, l.current, l.battery]),
      startY: y,
      margin: { left: m, right: m },
      tableWidth: cW,
      styles: {
        fontSize: 8,
        cellPadding: { top: 2, bottom: 2, left: 2, right: 2 },
        valign: "middle",
        lineColor: [187, 216, 213],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [10, 79, 74],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8.5,
        lineWidth: 0.4,
        lineColor: TEAL,
      },
      alternateRowStyles: { fillColor: [223, 242, 240] },
      rowPageBreak: "auto",
      columnStyles: {
        0: { cellWidth: tsW,   halign: "left"  },
        1: { cellWidth: metW,  halign: "right", textColor: [10, 122, 68]  },
        2: { cellWidth: metW,  halign: "right", textColor: [180,100,  0]  },
        3: { cellWidth: metW,  halign: "right", textColor: [26,  82, 118] },
        4: { cellWidth: metW,  halign: "right", textColor: [125, 90,   0] },
        5: { cellWidth: lastW, halign: "right", textColor: [107, 33, 168] },
      },
      didParseCell: (data) => {
        // Odd rows plain white
        if (data.row.index % 2 === 0 && data.section === "body") {
          data.cell.styles.fillColor = [247, 253, 252];
        }
      },
    });

    // ── FOOTER ─────────────────────────────────────────────────────────────
    doc.setFillColor(...NAVY);
    doc.rect(m, H - 10, cW, 7, "F");
    doc.setFont("helvetica", "italic"); doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(
      `Solar Dashboard  •  Auto-generated report  •  ${new Date().getFullYear()}`,
      W / 2, H - 5.5, { align: "center" }
    );

    doc.save(`Solar_Dashboard_Logs_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <SolarHeader />
      
      <div className="fixed top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <main className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto relative z-10 flex flex-col">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/" className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-slate-300 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-2xl font-bold text-white tracking-tight">System Logs Database</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={exportToExcel}
              className="flex items-center space-x-2 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel</span>
            </button>
            <button 
              onClick={exportToPDF}
              className="flex items-center space-x-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
            >
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        <div className="glass-panel p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-slate-400">Time Range:</span>
            <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
              <SelectTrigger className="w-[160px] bg-black/40 border-white/10 text-slate-200">
                <SelectValue placeholder="Select Time" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-slate-200">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="daily">Past 24 Hours</SelectItem>
                <SelectItem value="weekly">Past 7 Days</SelectItem>
                <SelectItem value="yearly">Past Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="ml-auto text-sm text-slate-400">
            Showing <span className="font-bold text-emerald-400">{filteredLogs.length}</span> results
          </div>
        </div>

        <div className="glass-panel p-1 flex-1 min-h-[400px] flex flex-col">
          <div className="overflow-auto flex-1 rounded-xl bg-black/20 custom-scrollbar">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Waktu (Time)</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Daya (Power)</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Beban (Load)</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Tegangan (Voltage)</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Arus (Current)</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Baterai (Battery)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                      No logs found matching your filters.
                    </td>
                  </tr>
                ) : timeFilter === 'daily' ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-400">
                        {log.power}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-400">
                        {log.load}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-300">
                        {log.voltage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-300">
                        {log.current}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-400">
                        {log.battery}
                      </td>
                    </tr>
                  ))
                ) : (
                  // Grouped accordion for weekly, yearly, all
                  groupedLogs?.map((group) => {
                    const avg = calculateAverages(group.logs);
                    const isExpanded = expandedDays[group.date];
                    return (
                      <React.Fragment key={group.date}>
                        <tr 
                          className="hover:bg-white/10 transition-colors cursor-pointer bg-white/5"
                          onClick={() => toggleDay(group.date)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-200 flex items-center space-x-2">
                            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            <span>{group.date} (Rata-rata)</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-400">
                            {avg.power}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-400">
                            {avg.load}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-300">
                            {avg.voltage}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-300">
                            {avg.current}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-400">
                            {avg.battery}
                          </td>
                        </tr>
                        {isExpanded && group.logs.map(log => (
                          <tr key={log.id} className="hover:bg-white/5 transition-colors bg-black/20">
                            <td className="px-6 py-3 pl-14 whitespace-nowrap text-xs text-slate-400">
                              🕒 {log.timestamp.split(' ')[1]}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-emerald-400/80">
                              {log.power}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-orange-400/80">
                              {log.load}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-blue-300/80">
                              {log.voltage}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-purple-300/80">
                              {log.current}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-green-400/80">
                              {log.battery}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </main>
    </div>
  );
};

export default Logs;
