@UI @Exceptions @regression
Feature: Verifying exception in container detail page

  Scenario: Exceptions in container detail page
    Given I am on the CSP Login page
    When I enter valid CSP credentials
    Then I should be logged in successfully
    Then I navigate to the Orders Module
    Then Create an Order with the below details
      | Port                    | AUBNE                          |
      | Customer                | 20 CUBE LOGISTICS PTY LTD      |
      | Consignee               | ACACIA RIDGE CONTAINERS PARK   |
      | CustomerReferenceNumber | CRN{{digits:6}}                |
      | OceanBillNumber         | OBN123                         |
      | VesselSchedule          | 1426S \| 9239862 \| FLORA DELMAS |
      | ContainerNo             | SAMP{{digits:7}}               |
      | TypeSize                | 40FR                           |
      | CargoType               | HAZ                            |
      | SealNo                  | SN123456                       |
      | GrossWeight             | 5000                           |
      | Temperature             | 30                             |
      | IMOCode                 | IMO123                         |
      | UNCode                  | UN1234                         |
      | DoorDirection           | Front                          |
    Then I should see a confirmation message indicating that the order has been created successfully
    Then I navigate to the Containers Module
    Then I Click on Container number
    Then I should see the exception in the container detail page
