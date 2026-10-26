@UI @CPPortalPreAlertUser @regression
Feature: Customer Portal file upload for Pre-Alert user

  Scenario: Pre-Alert user can upload files in Customer Portal
    Given I am on the login page
    When I sign in to the Customer Portal as the prealert user
    Then I should NOT see the dashboard page
    Then I navigate to the PreAlerts Module
    And clicks Upload Pre-Alert
    Then uploads a PDF file with comments "Testing Pre Alert v{{digits:4}}"
    Then the file should be uploaded successfully and comments "Testing Pre Alert v{{digits:4}}" visible
