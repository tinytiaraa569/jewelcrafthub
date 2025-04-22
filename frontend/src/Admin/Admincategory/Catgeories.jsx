import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { UploadCloud, Pencil, Trash2 } from 'lucide-react'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { backendurl } from '@/server'
import swal from "sweetalert";

const Categories = () => {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${backendurl}/category/all-categories`)
      setCategories(res.data.categories || [])
    } catch (err) {
      toast.error('Failed to fetch categories')
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const onSubmit = async (data) => {
    try {
      if (editMode && editingId) {
        await axios.put(
          `${backendurl}/category/update-category/${editingId}`,
          data,
          { withCredentials: true }
        )
        toast.success('Category updated successfully')
      } else {
        await axios.post(
          `${backendurl}/category/category-create`,
          data,
          { withCredentials: true }
        )
        toast.success('Category added successfully')
      }

      reset()
      setOpen(false)
      setEditMode(false)
      setEditingId(null)
      fetchCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed')
    }
  }

  const handleEdit = (category) => {
    setValue('categoryName', category.categoryName)
    setValue('categoryShortform', category.categoryShortform)
    setEditingId(category._id)
    setEditMode(true)
    setOpen(true)
  }

  const handleDelete = async (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this category!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(`${backendurl}/category/delete-category/${id}`, {
            withCredentials: true,
          });
          fetchCategories();
          toast.success("Category deleted successfully ");
        } catch (err) {
          toast.error("Failed to delete category ❌");
          console.error(err);
        }
      }
    });
  };
  

  const columns = useMemo(
    () => [
      {
        accessorKey: 'categoryName',
        header: 'Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'categoryShortform',
        header: 'Shortform',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => handleEdit(row.original)} className='dark:bg-neutral-700 cursor-pointer'>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className='dark:bg-red-500 dark:text-white cursor-pointer'
              onClick={() => handleDelete(row.original._id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Manage Design Categories</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add new categories or update existing ones to keep your portfolio structured.
          </p>
        </div>

        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) { setEditMode(false); reset(); } }}>
          <DialogTrigger asChild>
            <Button variant="outline" className="dark:bg-neutral-800 dark:border-neutral-700">
              <UploadCloud className="w-5 h-5 mr-2" />
              {editMode ? 'Edit Category' : 'Upload New Category'}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] dark:bg-neutral-900 bg-white rounded-xl shadow-xl border dark:border-neutral-700 px-6 py-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {editMode ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label htmlFor="categoryName" className='mb-2'>Category Name</Label>
                <Input
                  id="categoryName"
                  {...register('categoryName', { required: 'This field is required' })}
                  className="dark:bg-neutral-800 dark:border-neutral-700"
                />
                {errors.categoryName && <p className="text-red-500 text-sm mt-1">{errors.categoryName.message}</p>}
              </div>

              <div>
                <Label htmlFor="categoryShortform" className='mb-2'>Category Shortform</Label>
                <Input
                  id="categoryShortform"
                  {...register('categoryShortform', { required: 'This field is required' })}
                  className="dark:bg-neutral-800 dark:border-neutral-700"
                />
                {errors.categoryShortform && <p className="text-red-500 text-sm mt-1">{errors.categoryShortform.message}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button type="submit" className="w-full sm:w-auto cursor-pointer">
                  {editMode ? 'Update' : 'Submit'}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                    reset();
                    setOpen(false);
                    }}
                    className="w-full sm:w-auto bg-red-500 text-white hover:bg-red-400 hover:text-white cursor-pointer dark:bg-red-500 dark:text-white hover:dark:bg-red-400 hover:dark:text-white"
                >
                    Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border dark:border-neutral-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead className="bg-gray-50 dark:bg-neutral-800">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Categories