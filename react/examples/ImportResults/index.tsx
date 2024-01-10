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
                            {parsedDetails.errors[0].message}
                          </span>
                        </>
                      ) : (
                        <ul className={styles.errorsList}>
                          {parsedDetails?.errors?.map((error, errorIndex) => (
                            <li key={errorIndex} className={styles.errorItem}>
                              -{' '}
                              {error.imageId
                                ? `${error.imageId}: ${error.message}`
                                : error.code
                                ? `${error.code}: ${error.message}`
                                : error.message}
                            </li>
                          ))}
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