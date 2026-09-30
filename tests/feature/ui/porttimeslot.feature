@UI @Porttimeslot @regression
Feature: Port Time Slot Booking

  Scenario: VBS officer opens port time slot booking
    Given I am on the CSP Login page
    When I enter valid CSP credentials
    Then I should be logged in successfully
    Then I should click Port Time Slot Booking
