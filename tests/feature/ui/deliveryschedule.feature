@UI @ScheduleDelivery @regression
Feature: Schedule Delivery

  Scenario: Schedule Delivery for multiple Containers
    Given I am on the CSP Login page
    When I enter valid CSP credentials
    Then I should be logged in successfully
    Then I navigate to the Delivery Schedule Module
    And select the Port "AUBNE" Customer "BUNNINGS AUSTRALIA (QLD) - BUNAUS4" and Consignee "TEAM TRANSPORT TAXI - LINDUM - BUNWYN"
    Then Select all Containers
    And Schedule Delivery with the following Details
      | DeliveryDate   | Today            |
      | TimeFrom       | 10               |
      | TimeTo         | 12               |
      | CCRequiredTime | 11               |
      | TransportType  | Drop             |
      | TrailerType    | DROP             |
      | DockNumber     | Dock12345        |
      | Remarks        | Testing comments |
    Then Verify the Message "Cutoff Time Exceeded!"
    Then Click Cancel button
    And Click Schedule Delivery Button
    And Schedule Delivery with the following Details
      | DeliveryDate   | Today+5          |
      | TimeFrom       | 10               |
      | TimeTo         | 12               |
      | CCRequiredTime | 11               |
      | TransportType  | Drop             |
      | TrailerType    | DROP             |
      | DockNumber     | Dock12345        |
      | Remarks        | Testing comments |
    Then Verify the Message "Request accepted successfully"
    Then Verify the Message "Your booking has been accepted."
