// client/src/components/pages/public/inquiry/OrderCard.tsx
import React, { useRef, useState } from 'react';
import { Check, Download } from 'lucide-react';
import { FormData, OCCASIONS, PICKUP_LOCATIONS } from './constants';

// ─── Summary text ─────────────────────────────────────────────────────────────

export function buildSummaryText(form: FormData, orderNumber: string): string {
  const displayTime = form.targetTime === 'Custom' ? form.customTime : form.targetTime;
  const pickupLabel = PICKUP_LOCATIONS.find(l => l.id === form.pickupLocation)?.label ?? '';

  return [
    '🌸 Beyond the Bloom by A',
    `Order Reference: ${orderNumber}`,
    '',
    `Customer: ${form.customerName}`,
    `Contact: ${form.customerContact}`,
    ...(form.customerSocial ? [`Social: ${form.customerSocial}`] : []),
    '',
    `Target date: ${form.targetDate}`,
    `Target time: ${displayTime}`,
    `Fulfillment: ${form.fulfillment === 'pickup' ? `Pickup — ${pickupLabel}` : 'Delivery'}`,
    ...(form.fulfillment === 'delivery' && form.deliveryBooker === 'us' ? [
      `Address: ${form.deliveryAddress}`,
      ...(form.deliveryLandmark ? [`Landmark: ${form.deliveryLandmark}`] : []),
      `Receiver: ${form.receiverName} · ${form.receiverContact}`,
    ] : []),
    '',
    ...form.bouquets.flatMap((b, i) => [
      `--- Bouquet ${form.bouquets.length > 1 ? `#${i + 1}` : ''} ---`,
      `Name: ${b.bouquetItem ? b.bouquetItem.split(' —')[0] : b.bouquetName}`,
      ...(b.occasion ? [`Occasion: ${OCCASIONS.find(o => o.id === b.occasion)?.label ?? b.occasion}`] : []),
      ...(b.preferredBudget ? [`Budget: ${b.preferredBudget}`] : []),
      ...(b.details  ? [`Details: ${b.details}`] : []),
      ...(b.addOns.length ? [`Add-ons: ${b.addOns.join(', ')}`] : []),
      '',
    ]),
    'Total: TBD upon approval',
    'DP: TBD upon approval',
  ].join('\n');
}

// ─── Order Card (canvas) ──────────────────────────────────────────────────────

const OrderCard: React.FC<{ form: FormData; orderNumber: string }> = ({ form, orderNumber }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloaded, setDownloaded] = useState(false);

  const displayTime = form.targetTime === 'Custom' ? form.customTime : form.targetTime;
  const pickupLabel = PICKUP_LOCATIONS.find(l => l.id === form.pickupLocation)?.label ?? '';

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 600, PAD = 36, LINE_H = 22;

    const lines: { bold?: boolean; text: string; sub?: boolean }[] = [
      { bold: true, text: '🌸 Beyond the Bloom by A' },
      { sub:  true, text: orderNumber },
      { text: '' },
      { bold: true, text: `Customer: ${form.customerName}` },
      { text: `Contact: ${form.customerContact}` },
      ...(form.customerSocial ? [{ text: `Social: ${form.customerSocial}` }] : []),
      { text: '' },
      { bold: true, text: `Target date: ${form.targetDate}` },
      { bold: true, text: `Target time: ${displayTime}` },
      { bold: true, text: `Fulfillment: ${form.fulfillment === 'pickup' ? `Pickup — ${pickupLabel}` : 'Delivery'}` },
      ...(form.fulfillment === 'delivery' && form.deliveryBooker === 'us' ? [
        { text: `Address: ${form.deliveryAddress}` },
        ...(form.deliveryLandmark ? [{ text: `Landmark: ${form.deliveryLandmark}` }] : []),
        { text: `Receiver: ${form.receiverName} · ${form.receiverContact}` },
      ] : []),
      { text: '' },
      ...form.bouquets.flatMap((b, i) => [
        { bold: true, text: `Bouquet ${form.bouquets.length > 1 ? `#${i + 1}` : ''}: ${b.bouquetItem ? b.bouquetItem.split(' —')[0] : b.bouquetName}` },
        ...(b.occasion    ? [{ text: `Occasion: ${OCCASIONS.find(o => o.id === b.occasion)?.label ?? b.occasion}` }] : []),
        ...(b.preferredBudget ? [{ text: `Budget: ${b.preferredBudget}` }] : []),
        ...(b.details     ? [{ text: `Details: ${b.details}` }] : []),
        ...(b.addOns.length ? [{ text: `Add-ons: ${b.addOns.join(', ')}` }] : []),
        { text: '' },
      ]),
      { sub: true, text: 'Total: TBD upon approval' },
      { sub: true, text: 'DP: TBD upon approval' },
      { sub: true, text: 'btbya.com · Sta. Rosa, Laguna' },
    ];

    const H = PAD * 2 + lines.length * LINE_H + 60;
    canvas.width = W; canvas.height = H;

    ctx.fillStyle = '#FAF6F0';
    ctx.fillRect(0, 0, W, H);

    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#C4717A');
    grad.addColorStop(0.5, '#C9A84C');
    grad.addColorStop(1, '#6B7C5C');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, 5);
    ctx.fillRect(0, H - 5, W, 5);
    ctx.strokeStyle = '#C4717A33';
    ctx.lineWidth   = 1;
    ctx.strokeRect(0.5, 5, W - 1, H - 10);

    let y = PAD + 20;
    for (const line of lines) {
      if (!line.text) { y += LINE_H * 0.4; continue; }
      ctx.font      = line.bold ? 'bold 13px system-ui,sans-serif' : line.sub ? '11px system-ui,sans-serif' : '12px system-ui,sans-serif';
      ctx.fillStyle = line.sub ? '#2C2C2C99' : '#2C2C2C';
      const words = line.text.split(' ');
      let row = '';
      for (const word of words) {
        const test = row ? `${row} ${word}` : word;
        if (ctx.measureText(test).width > W - PAD * 2) { ctx.fillText(row, PAD, y); y += LINE_H; row = word; }
        else row = test;
      }
      if (row) { ctx.fillText(row, PAD, y); y += LINE_H; }
    }

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${orderNumber}.png`;
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <button type="button" onClick={download}
        className="inline-flex items-center gap-2 rounded-full bg-[#2C2C2C] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#444] active:scale-95">
        {downloaded ? <><Check className="h-4 w-4" />Downloaded!</> : <><Download className="h-4 w-4" />Download Order Card</>}
      </button>
    </>
  );
};

export default OrderCard;