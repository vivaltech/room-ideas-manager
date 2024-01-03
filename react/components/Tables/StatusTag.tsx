import React from 'react'
import { Tag } from 'vtex.styleguide'

interface StatusTagProps {
  data: string
}

const StatusTag = ({ data }: StatusTagProps) => {
  let tag

  switch (data) {
    case 'active':
      tag = <Tag bgColor="#16A085">{data}</Tag>
      break

    case 'inactive':
      tag = <Tag bgColor="#6b6b6af3">{data}</Tag>
      break

    default:
      break
  }

  return tag ?? <></>
}

export default StatusTag
