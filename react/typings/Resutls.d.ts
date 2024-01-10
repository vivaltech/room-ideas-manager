interface ResultData {
  productName: string
  productId: string
  productExternalId: string
  descriptionUpdated: boolean
  success: boolean
  details: string
}

interface ResultDetails {
  productName: string
  errors: ErrorData[]
}

interface ErrorData {
  code?: string
  file?: string
  imageId?: string
  message: string
  status?: number
}
