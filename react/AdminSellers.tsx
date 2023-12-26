import type { ChangeEvent } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { Layout, PageBlock, PageHeader } from "vtex.styleguide";
import { useIntl } from "react-intl";
import { useMutation } from "react-apollo";
import type { ParseResult } from "papaparse";
import Papa from "papaparse";

import importSellerProductsGQL from "./graphql/mutations/importSellerProducts.gql";
import { adminSellersMainMessages } from "./utils/adminSellersMessages";

interface ProductData {
  externalId?: string | number;
  status: string;
  name: string;
  brandId: string | number;
  categoryIds: string[] | number[];
  specs: Array<{
    name: string;
    values: string[];
  }>;
  attributes: Array<{
    name: string;
    value: string;
  }>;
  slug: string;
  images: Array<{
    id: string | number;
    url: string;
    alt?: string;
  }>;
  skus: Array<{
    name: string;
    externalId?: string | number;
    ean?: string | number;
    manufacturerCode?: string | number;
    isActive: boolean;
    weight: number;
    dimensions: {
      width: number;
      height: number;
      length: number;
    };
    specs: Array<{
      name: string;
      value: string;
    }>;
    images: string[];
  }>;
  origin: string;
  transportModal?: string | number;
  taxCode?: string | number;
}

const AdminSellers: React.FC = () => {
  const intl = useIntl();
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [errorProcessingCsv, setErrorProcessingCsv] = useState<string | null>(
    null
  );

  const [
    importSellerProductsMutation,
    {
      loading: loadingImportSellerProducts,
      error: errorImportSellerProducts,
      data: dataImportSellerProducts,
    },
  ] = useMutation(importSellerProductsGQL);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();

      reader.onload = async (e) => {
        const csvFile = e.target?.result as string;

        setProductData([]);
        setErrorProcessingCsv(null);

        Papa.parse<ProductData>(csvFile, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          transformHeader: (header: string) => header.trim(),
          transform: (value: string, header: string) => {
            try {
              const arrayHeaders = [
                "categoryIds",
                "specs",
                "attributes",
                "images",
                "skus",
              ];

              if (arrayHeaders.includes(header.toLowerCase())) {
                const jsonValue = value.replace(/'/g, '"').replace(/\\/g, "");

                return JSON.parse(jsonValue);
              }
            } catch (error) {
              const message = (error as Error)?.message;

              console.error(`Error al parsear JSON en ${header}: ${message}`);

              return value;
            }

            return value;
          },
          complete: (result: ParseResult<ProductData>) => {
            if (result.data && Array.isArray(result.data)) {
              const missingDataRows = result?.data?.filter((row) => {
                // TODO: Add validations
                return (
                  !row.status || !row.name || !row.brandId
                  //! row.categoryIds?.length ||
                  //! row.specs?.length ||
                  //! row.attributes?.length ||
                  //! row.slug ||
                  //! row.images?.length ||
                  //! row.skus?.length ||
                  //! row.origin
                );
              });

              if (missingDataRows?.length > 0) {
                setErrorProcessingCsv(
                  "Error: Algunas filas tienen datos incompletos."
                );
              } else {
                setProductData(result?.data);
                setErrorProcessingCsv(null);
              }
            } else {
              setErrorProcessingCsv(
                "No se pudo analizar el archivo CSV correctamente."
              );
            }
          },
          error: (err: { message: string }) => {
            setErrorProcessingCsv(
              `Error al analizar el archivo CSV: ${err.message}`
            );
          },
        });
      };

      reader.readAsText(file);
    },
    []
  );

  const handleImportClick = useCallback(async () => {
    try {
      console.info({ productData });

      await importSellerProductsMutation({
        variables: {
          productList: productData,
        },
      });
    } catch (e) {
      console.error("Error durante la importación de productos:", e);
    }
  }, [importSellerProductsMutation, productData]);

  useEffect(() => {
    if (!errorProcessingCsv) {
      return;
    }

    setProductData([]);
  }, [errorProcessingCsv]);

  useEffect(() => {
    if (errorImportSellerProducts) {
      console.error({ errorImportSellerProducts });
    }

    if (
      loadingImportSellerProducts ||
      errorImportSellerProducts ||
      !dataImportSellerProducts
    ) {
      return;
    }

    console.info({ dataImportSellerProducts });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loadingImportSellerProducts,
    errorImportSellerProducts,
    dataImportSellerProducts,
  ]);

  return (
    <Layout
      pageHeader={
        <PageHeader
          title={intl.formatMessage(adminSellersMainMessages.title)}
        />
      }
    >
      <PageBlock variation="full">
        <div className="flex flex-column">
          <input type="file" onChange={handleFileChange} />
          {errorProcessingCsv && (
            <p style={{ color: "red" }}>{errorProcessingCsv}</p>
          )}

          <button
            className="mt2 w5"
            onClick={handleImportClick}
            disabled={
              !productData ||
              productData.length === 0 ||
              loadingImportSellerProducts
            }
          >
            Importar
          </button>
        </div>
      </PageBlock>
    </Layout>
  );
};

export default AdminSellers;
