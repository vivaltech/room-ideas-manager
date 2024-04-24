# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Add `wakeUp` to fix first call. (If this doesn't work, we need to use a fetch instead of gql mutation).
- Product Slug is generated based on the product name removing special characters and replacing spaces with `-` and is normalize (convert á -> a and ç -> c).
- Product Spec is generated based on the `skuSpecs` from each product.
- Add `productStatus` as `active` always.
- Add `skuIsActive` as `true` always.

### Fixed

- Contemplate the conflict if the image id already exist and use it.

### Removed

- Remove `productTransportModal, productTaxCode, skuManufacturerCode` columns from csv.
- Remove `productSlug` column from csv and generate it based on productName.
- Remove `productSpecs (name_1 to name_5 and values_1 to values_5)` columns from csv and generate it based on `skuSpecs`.
- Remove `productStatus, skuIsActive` and add value as default.

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
