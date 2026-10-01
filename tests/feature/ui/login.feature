@UI @login @regression
Feature: Verify Customer Portal menu and dashboard

  @smoke @smoketest @regression
  Scenario: User can login with valid credentials
    Given I am on the CSP Login page
    When I enter valid CSP credentials
    Then I should be logged in successfully
    And I should see the dashboard page
    When I click on the Containers
    Then I should see the Containers page
    When I click on the Orders
    Then I should see the Orders page
    When I click on the Delivery Schedules
    Then I should see the Delivery Schedules page
    When I click on the Collections Schedules
    Then I should see the Collections Schedules page
    When I click on the logout button
    Then I should be logged out successfully
