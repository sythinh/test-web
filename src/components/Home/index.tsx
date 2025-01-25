'use client'
import { Avatar, Button, Layout, Popconfirm, Table, notification } from 'antd'
import Image from 'next/image'
import { Input } from 'antd'
import { ChangeEvent, useEffect, useState } from 'react'
import '@ant-design/v5-patch-for-react-19'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { UserOutlined } from '@ant-design/icons'

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const { Header, Content, Footer } = Layout
const { Search } = Input

// components
import ATMForm from '@/components/ModalATM/index'

// services
import apiService from '@/services/apiService'

// types
import { IATMType } from '@/types/atm'
// hooks
import useDebounce from '@/hooks/useDebounce'
import { BASE_URL, END_POINT } from '@/constants/endpoint'

const HomeComponent = () => {
  const [data, setData] = useState([])
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isRefetch, setRefetch] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [atm, setATM] = useState<IATMType>({
    atmName: '',
    image: '',
    manufacturer: '',
    type: '',
  })
  const [termSearch, setTermSearch] = useState<string>('')
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const columns = [
    {
      title: 'ATM Name',
      dataIndex: 'atmName',
      key: 'atmName',
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
      key: 'age',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Serial Number',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) =>
        image ? (
          <Image src={image} alt="avatar" width={50} height={50} />
        ) : (
          <Avatar size={50} icon={<UserOutlined />} />
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          {/* Edit Button */}
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>

          {/* Delete Button with Confirmation */}
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="default">Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  const debouncedSearchTerm = useDebounce(termSearch, 500) // 500ms debounce delay
  const { replace } = useRouter()

  const handleSearchTerm = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value.trim()
    setTermSearch(value)
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams as URLSearchParams)
    if (debouncedSearchTerm) {
      params.set('query', debouncedSearchTerm)
    } else {
      params.delete('query')
    }

    replace(`${pathname}?${params.toString()}`)
  }, [debouncedSearchTerm, pathname])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const result = await apiService.get(
          END_POINT.BANKS,
          searchParams?.get('query') || '',
        )
        const dataSource = result.map((item: IATMType) => ({
          ...item,
          key: item.id,
        }))
        setData(dataSource)
        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchParams, isRefetch])

  const handleSubmit = async (data: IATMType) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      let uploadResponse: Response
      let result
      formData.append('file', data?.image?.file?.originFileObj)
      if (data?.image?.file) {
        uploadResponse = await fetch(`${BASE_URL}/${END_POINT.UPLOAD}`, {
          method: 'POST',
          body: formData,
        })
        result = await uploadResponse.json()
      }

      const form = {
        ...data,
        ...(result?.url && {
          image: result?.url,
        }),
      }

      const res = data?.id
        ? await apiService.put(END_POINT.BANKS, form)
        : await apiService.post(END_POINT.BANKS, form)
      if (res) {
        setIsLoading(false)
        setRefetch((prevState) => !prevState)
        setIsOpenModal(false)
        notification.success({
          message: 'Success',
          description: data?.id
            ? 'Update ATM Successfully'
            : 'Create ATM Successfully',
        })
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message,
      })
      setIsLoading(false)
    }
  }

  const handleEdit = (record: IATMType) => {
    setIsOpenModal(true)
    setATM({ ...record, typeForm: 'edit' })
  }

  const handleDelete = async (record: string) => {
    await apiService.delete(END_POINT.BANKS, record)
    notification.warning({
      message: 'Delete',
      description: 'Deleted ATM Successfully',
    })
    setRefetch((prevState) => !prevState)
  }
  const handleAddNewATM = () => {
    setIsOpenModal(true)
    setATM({
      atmName: '',
      image: '',
      manufacturer: '',
      type: '',
    })
  }
  const handleExportData = () => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const excelFile = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    })
    saveAs(excelFile, 'data.xlsx')
  }

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
        className="w-full justify-between !h-24"
      >
        <div className="flex text-white items-center">
          <Image
            src={'/assets/images/logo.png'}
            alt="logon"
            width={100}
            height={40}
          />
          <p className="ml-10">ATM Management System</p>
        </div>
        <div className="flex gap-2 items-center">
          <Search placeholder="Search" onChange={handleSearchTerm} />
          <Button onClick={handleAddNewATM}>Add New ATM</Button>
          <Button onClick={handleExportData}>Export Data</Button>
        </div>
      </Header>
      <Content className="h-screen">
        <div
          style={{
            padding: 24,
            minHeight: 380,
          }}
        >
          <Table dataSource={data} columns={columns} loading={isLoading} />;
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>Created by Ant UED</Footer>
      {isOpenModal && (
        <ATMForm
          defaultValue={atm!}
          isOpenModal={isOpenModal}
          onCancel={() => setIsOpenModal(false)}
          onSubmit={handleSubmit}
          loading={isLoading}
        />
      )}
    </Layout>
  )
}

export default HomeComponent
