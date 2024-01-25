import React from 'react'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { useIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'

import { importResultsMessages } from '../../utils/adminSellersMessages'
import styles from '../../styles/ImportResults.module.css'

interface ImportResultsProps {
  importResults: ResultData[]
}

const ImportResults: React.FC<ImportResultsProps> = ({ importResults }) => {
  const intl = useIntl()
  const importResultParsed = importResults?.map((result) => {
    const parsedDetails: ResultDetails = JSON.parse(result?.details)

    let auxResult

    if ('__typename' in result) {
      // eslint-disable-next-line dot-notation
      delete result['__typename']
    }

    if (result?.descriptionUpdated === null) {
      // eslint-disable-next-line dot-notation
      const { descriptionUpdated, ...filteredResult } = result

      auxResult = filteredResult
    } else {
      auxResult = {
        ...result,
        descriptionUpdated: result?.descriptionUpdated
          ? intl.formatMessage(importResultsMessages.yes)
          : intl.formatMessage(importResultsMessages.no),
      }
    }

    return {
      ...auxResult,
      success: auxResult?.success
        ? intl.formatMessage(importResultsMessages.yes)
        : intl.formatMessage(importResultsMessages.no),
      details: {
        ...parsedDetails,
        errors: parsedDetails?.errors?.map((error) => {
          const errorMessage = !error.status
            ? error?.message
            : error.status === 409
            ? `${intl.formatMessage(
                importResultsMessages.conflictWithImage1
              )} ${error?.file}. ${intl.formatMessage(
                importResultsMessages.conflictWithImage2
              )}`
            : error.status === 403
            ? `${intl.formatMessage(importResultsMessages.openImageError1)} ${
                error?.file
              }. ${intl.formatMessage(importResultsMessages.openImageError2)}`
            : error?.message

          return { ...error, message: errorMessage }
        }),
      },
    }
  })

  const handleDownloadResultsJson = () => {
    const jsonData = importResultParsed

    const resultsAsString = JSON.stringify(jsonData, null, 2)
    const blob = new Blob([resultsAsString], { type: 'application/json' })

    saveAs(blob, 'import_results.json')
  }

  function s2ab(s: string) {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)

    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff

    return buf
  }

  const handleDownloadResultsXlsx = () => {
    const xlsData = importResultParsed

    const worksheet = XLSX.utils.json_to_sheet(
      xlsData?.map((item) => ({
        ...item,
        details: JSON.stringify(item.details),
      }))
    )

    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Import Results')

    const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' })
    const excelBlob = new Blob([s2ab(excelData)], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    saveAs(excelBlob, 'import_results.xlsx')
  }

  return (
    <>
      {importResults && importResults.length > 0 ? (
        <div className={styles.importResultsContainer}>
          <div className="flex flex-row">
            <h2 className={styles.title}>
              {intl.formatMessage(importResultsMessages.title)}
            </h2>
            <Button
              variation="secondary"
              size="small"
              onClick={handleDownloadResultsJson}
            >
              {intl.formatMessage(importResultsMessages.downloadResultsJson)}
            </Button>
            <div className="mr5" />
            <Button
              variation="secondary"
              size="small"
              onClick={handleDownloadResultsXlsx}
            >
              {intl.formatMessage(importResultsMessages.downloadResultsXlsx)}
            </Button>
          </div>

          <ul className={styles.resultsList}>
            {importResults?.map((result, index) => {
              const parsedDetails: ResultDetails = JSON.parse(result?.details)

              return (
                <li key={index} className={styles.resultItem}>
                  <div>
                    <strong className={styles.label}>
                      {intl.formatMessage(importResultsMessages.product)}:
                    </strong>{' '}
                    <span className={styles.productName}>
                      {result?.productId
                        ? `${intl.formatMessage(
                            importResultsMessages.productId
                          )}: ${result?.productId} - `
                        : ''}
                      {result?.productExternalId
                        ? `${intl.formatMessage(
                            importResultsMessages.productExternalId
                          )}: ${result?.productExternalId} - `
                        : ''}
                      {result?.productName}
                    </span>
                  </div>

                  <div>
                    <strong className={styles.label}>
                      {intl.formatMessage(importResultsMessages.success)}:
                    </strong>
                    <span
                      className={
                        result?.success ? styles.success : styles.notSuccess
                      }
                    >
                      {result?.success
                        ? intl.formatMessage(importResultsMessages.yes)
                        : intl.formatMessage(importResultsMessages.no)}
                    </span>
                  </div>

                  {result?.descriptionUpdated !== undefined &&
                    result?.descriptionUpdated !== null && (
                      <div>
                        <strong className={styles.label}>
                          {intl.formatMessage(
                            importResultsMessages.descriptionUpdated
                          )}
                          :
                        </strong>
                        <span
                          className={
                            result?.descriptionUpdated
                              ? styles.success
                              : styles.notSuccess
                          }
                        >
                          {result?.descriptionUpdated
                            ? intl.formatMessage(importResultsMessages.yes)
                            : intl.formatMessage(importResultsMessages.no)}
                        </span>
                      </div>
                    )}

                  {!result.success && (
                    <div>
                      <strong className={styles.label}>
                        {intl.formatMessage(importResultsMessages.errors)}:
                      </strong>
                      {parsedDetails?.errors?.length === 1 ? (
                        <>
                          {' '}
                          <span className={styles.errorItem}>
                            {!parsedDetails.errors[0].status ? (
                              parsedDetails.errors[0].message
                            ) : parsedDetails.errors[0].status === 409 ? (
                              <span>
                                {intl.formatMessage(
                                  importResultsMessages.conflictWithImage1
                                )}{' '}
                                <a
                                  href={parsedDetails.errors[0].file}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={styles.imageUrl}
                                >
                                  {parsedDetails.errors[0].file}
                                </a>
                                {'. '}
                                {intl.formatMessage(
                                  importResultsMessages.conflictWithImage2
                                )}
                              </span>
                            ) : parsedDetails.errors[0].status === 403 ? (
                              <span>
                                {intl.formatMessage(
                                  importResultsMessages.openImageError1
                                )}{' '}
                                <a
                                  href={parsedDetails.errors[0].file}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={styles.imageUrl}
                                >
                                  {parsedDetails.errors[0].file}
                                </a>
                                {'. '}
                                {intl.formatMessage(
                                  importResultsMessages.openImageError2
                                )}
                              </span>
                            ) : (
                              parsedDetails.errors[0].message
                            )}
                          </span>
                        </>
                      ) : (
                        <ul className={styles.errorsList}>
                          {parsedDetails?.errors?.map((error, errorIndex) => {
                            const errorMessage = !error.status ? (
                              error.message
                            ) : error.status === 409 ? (
                              <>
                                {intl.formatMessage(
                                  importResultsMessages.conflictWithImage1
                                )}{' '}
                                <a
                                  href={error.file}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={styles.imageUrl}
                                >
                                  {error.file}
                                </a>
                                {'. '}
                                {intl.formatMessage(
                                  importResultsMessages.conflictWithImage2
                                )}
                              </>
                            ) : error.status === 403 ? (
                              <>
                                {intl.formatMessage(
                                  importResultsMessages.openImageError1
                                )}{' '}
                                <a
                                  href={error.file}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={styles.imageUrl}
                                >
                                  {error.file}
                                </a>
                                {'. '}
                                {intl.formatMessage(
                                  importResultsMessages.openImageError2
                                )}
                              </>
                            ) : (
                              error.message
                            )

                            return (
                              <li key={errorIndex} className={styles.errorItem}>
                                -{' '}
                                {error.imageId ? (
                                  <>
                                    {error.imageId}: {errorMessage}
                                  </>
                                ) : error.code ? (
                                  <>
                                    {error.code}: {errorMessage}
                                  </>
                                ) : (
                                  <>{errorMessage}</>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default ImportResults
