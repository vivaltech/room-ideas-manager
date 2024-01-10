import React from 'react'
import { useIntl } from 'react-intl'

import { importResultsMessages } from '../../utils/adminSellersMessages'
import styles from '../../styles/ImportResults.module.css'

interface ImportResultsProps {
  importResults: ResultData[]
}

const ImportResults: React.FC<ImportResultsProps> = ({ importResults }) => {
  const intl = useIntl()

  return (
    <>
      {importResults && importResults.length > 0 ? (
        <div className={styles.importResultsContainer}>
          <h2 className={styles.title}>
            {intl.formatMessage(importResultsMessages.title)}
          </h2>
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
                      {result?.productId ? `${result?.productId} - ` : ''}
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
