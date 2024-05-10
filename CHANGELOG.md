# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.5.0] - 2024-05-10

### Added

- Add new documentation
- Add new examples

### Fixed

- Input skuWeight in kg

## [1.4.1] - 2024-05-09

### Added

- Add new documentation

## [1.4.0] - 2024-05-09

### Added

- Add rows of description and required columns. Then omit this rows at the momento of processing the csv.

### Fixed

- Fix documentation button smaller

## [1.3.1] - 2024-04-29

### Added

- Add documentation button

## [1.3.0] - 2024-04-26

### Added

- Add `wakeUp` to fix first call. (If this doesn't work, we need to use a fetch instead of gql mutation).
- `productSlug` is generated based on the `productName` removing special characters and replacing spaces with `-` and is normalize (convert á -> a and ç -> c).
- `productSpecs` is generated based on the `skuSpecs` from each product.
- Add `productStatus` as `active` always.
- Add `skuIsActive` as `true` always.
- Add `skuName` generated from `productName` + values of the `skuSpecs`.
- Add `skuImage_url_X (1 to 10)`, each row have the image of that sku.
  - If 2 different skus are from the same product, the accumulation of the images of each sku generates the `productImages`.
  - `imageId` is generated from `productName` normalized + `_X` (where X is the number of image) + `.png`.
  - `imageAlt` is generated from `productName` normalized + `_X` (where X is the number of image).
- `productName` can be used as a column to know if 2 or more skus are from the same product.

### Fixed

- Contemplate the conflict if the image id already exist and use it.
- Change message `Is Active` to `Status`

### Removed

- Remove `productTransportModal, productTaxCode, skuManufacturerCode` columns from csv.
- Remove `productSlug` column from csv.
- Remove `productSpecs (name_1 to name_5 and values_1 to values_5)` columns from csv and generate it based on `skuSpecs`.
- Remove `productStatus, skuIsActive` and add value as default.
- Remove `skuName` column from csv.
- Remove `productImages (id_1 to id_10 and url_1 to url_10 and alt_1 to alt_10)` columns from csv.

## [1.2.1] - 2024-04-03

### Fixed

- Fix empty column on example

## [1.2.0] - 2024-04-02

### Added

- Add more specs columns

## [1.1.0] - 2024-03-14

## [1.0.3] - 2024-03-11

### Added

- Add more attributes columns

## [1.0.2] - 2024-01-24

## [1.0.1] - 2024-01-18

### Fixed

- Fix success case

## [1.0.0] - 2024-01-15

## [0.1.1] - 2024-01-15

## [0.1.0] - 2024-01-10

## [0.0.1] - 2024-01-05

### Added

- Initial release.
