import { useMemo, useState } from 'react';
import EmptyState from '@/src/components/portal/EmptyState';
import LoadingSkeleton from '@/src/components/portal/LoadingSkeleton';
import PageHeader from '@/src/components/portal/PageHeader';
import SectionCard from '@/src/components/portal/SectionCard';
import StatusBadge from '@/src/components/portal/StatusBadge';
import StatCard from '@/src/components/portal/StatCard';
import { usePortal } from '@/src/components/portal/PortalContext';
import { formatCurrency, formatDate } from '@/src/lib/portal/format';
import type { Invoice, InvoiceStatus, PaymentMethod } from '@/src/types/portal';

const checkoutProducts = [
  { id: 'x1', label: 'Losse les (90 min)', price: 82.5 },
  { id: 'x2', label: 'Pakket 5 lessen', price: 395 },
  { id: 'x3', label: 'Examentraining', price: 119 },
];

function CheckoutDialog({
  open,
  onClose,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: (payload: {
    productId: string;
    label: string;
    amount: number;
    paymentMethod: PaymentMethod;
    success: boolean;
  }) => Promise<void>;
}) {
  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState(checkoutProducts[0].id);
  const [paymentMethod, setPaymentMethod] = useState<'iDEAL' | 'Kaart'>('iDEAL');
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');

  if (!open) return null;

  const selectedProduct = checkoutProducts.find((item) => item.id === productId) ?? checkoutProducts[0];

  const complete = async (success: boolean) => {
    try {
      await onComplete({
        productId: selectedProduct.id,
        label: selectedProduct.label,
        amount: selectedProduct.price,
        paymentMethod,
        success,
      });
      setSubmitState(success ? 'success' : 'error');
    } catch {
      setSubmitState('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Extra les of pakket kopen</h3>
          <button type="button" onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-slate-700">
            Sluiten
          </button>
        </div>

        {submitState === 'success' ? (
          <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-800">Betaling gelukt</p>
            <p className="text-sm text-emerald-700">Je aanvraag is ontvangen en zichtbaar in je betalingsoverzicht.</p>
            <button type="button" onClick={onClose} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">
              Klaar
            </button>
          </div>
        ) : null}

        {submitState === 'error' ? (
          <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm font-semibold text-rose-800">Betaling mislukt</p>
            <p className="text-sm text-rose-700">De betaling kon niet worden afgerond. Probeer het opnieuw.</p>
            <button type="button" onClick={() => setSubmitState('idle')} className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white">
              Opnieuw proberen
            </button>
          </div>
        ) : null}

        {submitState === 'idle' ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? 'bg-primary' : 'bg-slate-200'}`} />
              ))}
            </div>

            {step === 1 ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Kies product</p>
                {checkoutProducts.map((item) => (
                  <label key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm">
                    <span>{item.label}</span>
                    <span className="font-semibold">{formatCurrency(item.price)}</span>
                    <input type="radio" name="product" checked={item.id === productId} onChange={() => setProductId(item.id)} />
                  </label>
                ))}
                <button type="button" onClick={() => setStep(2)} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
                  Volgende
                </button>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Kies betaalmethode</p>
                {(['iDEAL', 'Kaart'] as const).map((method) => (
                  <label key={method} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm">
                    {method}
                    <input type="radio" name="method" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                  </label>
                ))}
                <div className="flex gap-2">
                  <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                    Terug
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
                    Volgende
                  </button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-3">
                <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">{selectedProduct.label}</p>
                  <p>Betaalmethode: {paymentMethod}</p>
                  <p>Totaal: {formatCurrency(selectedProduct.price)}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setStep(2)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                    Terug
                  </button>
                  <button type="button" onClick={() => void complete(true)} className="rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white">
                    Betaal nu
                  </button>
                  <button type="button" onClick={() => void complete(false)} className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700">
                    Simuleer fout
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function PortalBillingPage() {
  const { data, loading, error, runCheckout } = usePortal();
  const [filter, setFilter] = useState<InvoiceStatus | 'Alles'>('Alles');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const invoices = useMemo(
    () =>
      (data?.invoices ?? [])
        .filter((invoice) => (filter === 'Alles' ? true : invoice.status === filter))
        .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()),
    [data?.invoices, filter],
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Betalingen en pakketten" description="Facturen, saldo, pakketstatus en extra lessen." />
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="Betalingen niet beschikbaar" description={error ?? 'Geen data gevonden.'} />;
  }

  const selectedInvoice: Invoice | null = invoices.find((invoice) => invoice.id === selectedInvoiceId) ?? invoices[0] ?? null;
  const paidCount = data.invoices.filter((invoice) => invoice.status === 'Betaald').length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Betalingen en pakketten"
        description="Volg je pakket, open saldo en facturen. Vraag extra lessen of pakketten aan; betalingen worden vastgelegd in je overzicht."
        actions={
          <button
            type="button"
            onClick={() => setCheckoutOpen(true)}
            className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Extra les/pakket kopen
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Huidig pakket" value={data.packageInfo.packageName} />
        <StatCard label="Openstaand saldo" value={formatCurrency(Math.max(0, data.packageInfo.openBalance))} />
        <StatCard label="Betaalde facturen" value={`${paidCount}/${data.invoices.length}`} />
        <StatCard label="Volgende termijn" value={data.packageInfo.nextInstallmentDate ? formatDate(data.packageInfo.nextInstallmentDate) : 'n.v.t.'} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Facturen" subtitle="Download, status en openstaande termijnen">
          <div className="mb-3">
            <select value={filter} onChange={(event) => setFilter(event.target.value as InvoiceStatus | 'Alles')} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option>Alles</option>
              <option>Betaald</option>
              <option>Openstaand</option>
              <option>Verlopen</option>
              <option>In behandeling</option>
            </select>
          </div>
          {invoices.length === 0 ? (
            <EmptyState title="Geen facturen" description="Er zijn geen facturen voor deze filter." />
          ) : (
            <div className="grid gap-2">
              {invoices.map((invoice) => (
                <button
                  key={invoice.id}
                  type="button"
                  onClick={() => setSelectedInvoiceId(invoice.id)}
                  className={`rounded-xl border p-3 text-left ${
                    selectedInvoice?.id === invoice.id ? 'border-primary bg-primary/5' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">Factuur {invoice.invoiceNumber}</p>
                    <StatusBadge value={invoice.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    {invoice.period} - {formatCurrency(invoice.amount)} - Vervaldatum {formatDate(invoice.dueDate)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Factuurdetail" subtitle="Status en downloadplaceholder">
          {selectedInvoice ? (
            <div className="space-y-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900">Factuur {selectedInvoice.invoiceNumber}</p>
                <p className="mt-1 text-xs text-slate-600">{selectedInvoice.period}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
                <p>Bedrag: {formatCurrency(selectedInvoice.amount)}</p>
                <p>Vervaldatum: {formatDate(selectedInvoice.dueDate)}</p>
                <div className="mt-2">
                  <StatusBadge value={selectedInvoice.status} />
                </div>
              </div>
              <a
                href={selectedInvoice.downloadUrl ?? '#'}
                className="inline-flex rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Download PDF (placeholder)
              </a>
            </div>
          ) : (
            <EmptyState title="Geen factuur geselecteerd" description="Kies links een factuur voor details." />
          )}
        </SectionCard>
      </div>

      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onComplete={async (payload) => {
          await runCheckout(payload);
        }}
      />
    </div>
  );
}
