@UI @Prealert @wip @regression @Test123
Feature: Pre-Alert document upload and order creation
  # @wip: the last two steps ('Create an Order with the "<container>" Container') have no step definition yet.
  # Remove @wip once that step is implemented.

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
    When Create an Order with the "CRNW1235" Container
    Then I should see a confirmation message indicating that the order has been created successfully
