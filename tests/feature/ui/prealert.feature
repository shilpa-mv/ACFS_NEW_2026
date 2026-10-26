@UI @Prealert123 @regression
Feature: Pre-Alert document upload and order creation

  Scenario: Upload a valid Pre-Alert PDF document and create an order
    Given I am on the CSP Login page
    When I enter valid CSP credentials
    Then I should be logged in successfully
    Then I navigate to the PreAlerts Module
    And clicks Upload Pre-Alert
    Then uploads a PDF file with comments "Testing Pre Alert v{{digits:4}}"
    Then the file should be uploaded successfully and comments "Testing Pre Alert v{{digits:4}}" visible
    And a new record should appear in the Pre Alert List screen
    When click on Create Order from the new Pre Alert record
    Then User has the provison to create order with PDF document visible on right side
    When Create a Pre-Alert Order with the below details
      | Port                    | AUBNE                       |
      | Customer                | 20 CUBE LOGISTICS PTY LTD   |
      | Consignee               | ACACIA RIDGE CONTAINERS PARK |
      | CustomerReferenceNumber | CRN{{digits:6}}             |
      | OceanBillNumber         | OBN123                      |
      | VesselSchedule          | 9207388   |
      | ContainerNo             | SAMP{{digits:7}}            |
      | TypeSize                | 40FR                        |
      | CargoType               | HAZ                         |
      | SealNo                  | SN123456                    |
      | GrossWeight             | 5000                        |
      | Temperature             | 30                          |
      | IMOCode                 | IMO123                      |
      | UNCode                  | UN1234                      |
      | DoorDirection           | Front                       |
    Then I should see a confirmation message indicating that the order has been created successfully
