import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageHeader } from '@/components/ui/PageHeader'
import { Toast } from '@/components/ui/Toast'
import { Modal } from '@/components/ui/Modal'
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Loader2,
  Search,
  AlertCircle,
} from 'lucide-react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type {
  SortingState,
} from '@tanstack/react-table'
import http from '@/utils/http'

export const Route = createFileRoute('/_dashboard/residents/warga')({
  component: WargaPage,
})

interface Resident {
  id: string
  nik: string
  nama: string
  statusKeanggotaan: string
}

const residentsQueryOptions = {
  queryKey: ['residents'] as const,
  queryFn: async (): Promise<Resident[]> => {
    const res = await http.get('/residents')
    return (res.data?.data ?? []) as Resident[]
  },
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700 border-blue-200/50',
  'bg-emerald-100 text-emerald-700 border-emerald-200/50',
  'bg-amber-100 text-amber-700 border-amber-200/50',
  'bg-indigo-100 text-indigo-700 border-indigo-200/50',
  'bg-rose-100 text-rose-700 border-rose-200/50',
]

const getInitials = (fullName: string) =>
  fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

const getAvatarBg = (id: string) =>
  AVATAR_COLORS[parseInt(id) || 0 % AVATAR_COLORS.length]

const columnHelper = createColumnHelper<Resident>()

const columns = [
  columnHelper.accessor('nama', {
    header: 'Nama Lengkap',
    cell: (info) => {
      const resident = info.row.original
      return (
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border shadow-inner select-none ${getAvatarBg(
              resident.id,
            )}`}
          >
            {getInitials(resident.nama)}
          </div>
          <span className="text-slate-800 font-bold text-xs block leading-tight">
            {resident.nama}
          </span>
        </div>
      )
    },
  }),
  columnHelper.accessor('nik', {
    header: 'NIK',
    cell: (info) => (
      <span className="text-xs text-slate-500 font-semibold">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('statusKeanggotaan', {
    header: 'Status Keanggotaan',
    cell: (info) => {
      const aktif = info.getValue().toUpperCase() === 'AKTIF'
      return aktif ? (
        <span className="bg-[#0047cc] text-white font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase inline-block select-none">
          Aktif
        </span>
      ) : (
        <span className="bg-slate-100 text-slate-600 border border-slate-200/50 font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase inline-block select-none">
          {info.getValue()}
        </span>
      )
    },
  }),
]

function WargaPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const { data: residents = [], isPending, isError, error } = useQuery(
    residentsQueryOptions,
  )

  const data = useMemo(() => residents, [residents])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    autoResetPageIndex: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 8 } },
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const filteredRows = table.getFilteredRowModel().rows
  const firstRow = filteredRows.length === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min((pageIndex + 1) * pageSize, filteredRows.length)
  const pageButtons = Array.from(
    { length: table.getPageCount() },
    (_, i) => i + 1,
  ).slice(Math.max(0, pageIndex - 1), pageIndex + 2)

  return (
    <div className="max-w-6xl mx-auto p-1 animate-[fadeIn_0.3s_ease-out] relative space-y-8">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <PageHeader
        title="Data Warga"
        actions={
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-[#0047cc] hover:bg-[#003bb3] text-white font-bold rounded-xl px-4 py-2.5 text-xs shadow-md shadow-[#0047cc]/15 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Warga</span>
          </button>
        }
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Tambah Warga"
        maxWidthClass="max-w-2xl"
      >
        <div className="text-xs text-slate-500 font-semibold py-8 text-center">
          Pendaftaran warga baru dilakukan melalui halaman registrasi.
        </div>
      </Modal>

      <div className="bg-white rounded-3xl border border-slate-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Cari nama atau NIK..."
              disabled={isPending || isError}
              className="w-full bg-slate-50 hover:bg-slate-100/30 border border-slate-200/80 text-slate-700 placeholder-slate-400 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-[#0047cc] focus:ring-2 focus:ring-[#0047cc]/10 transition-all font-semibold disabled:opacity-50"
            />
          </div>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400 text-xs font-semibold">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memuat data warga...</span>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center gap-2 py-16 text-rose-600 text-xs font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>
              Gagal memuat data: {(error as Error)?.message ?? 'Terjadi kesalahan'}
            </span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const sorted = header.column.getIsSorted()
                        return (
                          <th
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                            className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-4 bg-slate-50/20 border-b border-slate-100 cursor-pointer select-none hover:text-slate-600 transition-colors"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {sorted === 'asc'
                              ? ' ↑'
                              : sorted === 'desc'
                                ? ' ↓'
                                : ''}
                          </th>
                        )
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-100/60 hover:bg-slate-50/10 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {table.getRowModel().rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-6 py-10 text-center text-xs text-slate-400 font-semibold"
                      >
                        Tidak ada warga yang cocok dengan pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 flex justify-between items-center border-t border-slate-100 bg-slate-50/10 text-xs">
              <span className="text-slate-400 font-semibold">
                Menampilkan {firstRow}-{lastRow} dari {filteredRows.length} warga
              </span>
              <div className="flex items-center gap-1.5 select-none">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="p-1 border border-slate-200 text-slate-500 hover:text-slate-700 disabled:text-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {pageButtons.map((page) => (
                  <button
                    key={page}
                    onClick={() => table.setPageIndex(page - 1)}
                    className={`w-7 h-7 font-bold rounded-lg text-xs flex items-center justify-center cursor-pointer transition-colors ${
                      page === pageIndex + 1
                        ? 'bg-[#0047cc] text-white shadow-sm shadow-[#0047cc]/15'
                        : 'border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="p-1 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
