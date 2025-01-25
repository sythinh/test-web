import React, { memo, useRef, useState } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Upload,
  Modal,
  Typography,
  Avatar,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'

// types
import { IATMType } from '@/types/atm'
import type { FileType } from '@/types/file'
import { UploadProps } from 'antd/lib'
import { ATMType } from '@/constants'
interface IAtmFormProps {
  isOpenModal?: boolean
  loading?: boolean
  defaultValue?: IATMType
  onCancel?: () => void
  onSubmit: (values: IATMType) => void
}

const ATMForm = ({
  isOpenModal,
  defaultValue,
  loading = true,
  onCancel,
  onSubmit,
}: IAtmFormProps) => {
  const [form] = Form.useForm()
  const [imageUrl, setImageUrl] = useState<string>(
    (defaultValue?.image as string) || '',
  )
  const uploadInputRef = useRef<HTMLInputElement>(null)

  const onFinish = (values: IATMType) => {
    onSubmit({
      ...values,
      ...(defaultValue?.id && { id: defaultValue?.id }),
    })
  }

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 1
    if (!isLt2M) {
      message.error('Image upload must smaller than 1MB!')
    }
    return isJpgOrPng && isLt2M
  }

  // convert file image to base64
  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
  }

  //handle change
  const handleUploadImage: UploadProps['onChange'] = async (info) => {
    // Get this url from response in real world.
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setImageUrl(url)
      })
    }
  }

  return (
    <Modal
      title={
        <Typography.Title level={3} className="text-lg font-bold">
          {defaultValue?.typeForm ? 'Edit ATM' : 'Add New ATM'}
        </Typography.Title>
      }
      open={isOpenModal}
      onCancel={onCancel}
      footer={null}
      width={600}
      confirmLoading={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={defaultValue}
      >
        <Form.Item
          label="ATM Name"
          name="atmName"
          rules={[{ required: true, message: 'ATM name is required' }]}
        >
          <Input placeholder="Enter ATM name" />
        </Form.Item>

        <Form.Item
          label="Manufacturer"
          name="manufacturer"
          rules={[{ required: true, message: 'Manufacturer is required' }]}
        >
          <Input placeholder="Enter manufacturer name" />
        </Form.Item>

        <Form.Item
          label="ATM Type"
          name="type"
          rules={[{ required: true, message: 'Please select ATM type' }]}
        >
          <Select placeholder="Select ATM type" options={ATMType}></Select>
        </Form.Item>

        <Form.Item
          label="Serial Number"
          name="serialNumber"
          rules={[{ required: true, message: 'Serial number is required' }]}
        >
          <Input type="number" placeholder="Enter serial number" />
        </Form.Item>

        <Form.Item label="ATM Image" name="image">
          <Upload
            name="image"
            ref={uploadInputRef}
            showUploadList={false}
            style={{ display: 'none' }}
            beforeUpload={beforeUpload}
            onChange={handleUploadImage}
          >
            {' '}
            {imageUrl ? (
              <Avatar
                size={120}
                src={imageUrl}
                className="!border-zinc-400 relative"
                crossOrigin="anonymous"
                data-testid="avatar-image"
              />
            ) : (
              <Button
                icon={<UploadOutlined />}
                size="large"
                className="bg-blue-500 text-white"
              >
                Upload Image
              </Button>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <div className="text-center flex items-center justify-center gap-2">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 text-white px-6 py-2"
            >
              Save Change
            </Button>

            <Button
              type="default"
              htmlType="button"
              className="text-white px-6 py-2"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default memo(ATMForm)
