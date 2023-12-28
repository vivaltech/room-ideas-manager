interface ResultData {
  productName: string
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
}
