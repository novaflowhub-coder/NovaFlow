# NovaFlow Metadata Management Backend

A Spring Boot REST API service for managing NovaFlow metadata including connections, integration objects, rules, and configurations.

## Features

- **Connection Management**: CRUD operations for database and API connections
- **Integration Object Management**: Manage tables, views, APIs, files, and queues
- **Rule Management**: Create and manage validation, business, and transformation rules
- **Schema Management**: Handle object schema attributes and definitions
- **Holiday Calendar Management**: Manage business holiday calendars
- **RESTful APIs**: Full REST API with OpenAPI/Swagger documentation
- **Database Integration**: PostgreSQL with JPA/Hibernate
- **Exception Handling**: Comprehensive error handling and validation

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **PostgreSQL**
- **HikariCP** (Connection Pooling)
- **OpenAPI 3** (Swagger Documentation)
- **Maven**

## API Endpoints

The service provides comprehensive REST APIs for all metadata entities:

### Connection Management
- `GET /api/connections` - Get all connections
- `GET /api/connections/{id}` - Get connection by ID
- `GET /api/connections/domain/{domainId}` - Get connections by domain
- `POST /api/connections` - Create new connection
- `PUT /api/connections/{id}` - Update connection
- `DELETE /api/connections/{id}` - Delete connection
- `PUT /api/connections/{id}/activate` - Activate connection
- `PUT /api/connections/{id}/deactivate` - Deactivate connection

### Integration Object Management
- `GET /api/integration-objects` - Get all integration objects
- `GET /api/integration-objects/{id}` - Get integration object by ID
- `GET /api/integration-objects/domain/{domainId}` - Get objects by domain
- `POST /api/integration-objects` - Create new integration object
- `PUT /api/integration-objects/{id}` - Update integration object
- `DELETE /api/integration-objects/{id}` - Delete integration object
- `PUT /api/integration-objects/{id}/activate` - Activate object
- `PUT /api/integration-objects/{id}/deactivate` - Deactivate object

### Rule Management
- `GET /api/rules` - Get all rules
- `GET /api/rules/{id}` - Get rule by ID
- `GET /api/rules/domain/{domainId}` - Get rules by domain
- `POST /api/rules` - Create new rule
- `PUT /api/rules/{id}` - Update rule
- `DELETE /api/rules/{id}` - Delete rule
- `PUT /api/rules/{id}/activate` - Activate rule
- `PUT /api/rules/{id}/deactivate` - Deactivate rule

### Scaffold Management
- `GET /api/scaffolds` - Get all scaffolds
- `GET /api/scaffolds/{id}` - Get scaffold by ID
- `GET /api/scaffolds/domain/{domainId}` - Get scaffolds by domain
- `GET /api/scaffolds/source/{sourceObjectId}` - Get scaffolds by source object
- `GET /api/scaffolds/target/{targetObjectId}` - Get scaffolds by target object
- `POST /api/scaffolds` - Create new scaffold
- `PUT /api/scaffolds/{id}` - Update scaffold
- `DELETE /api/scaffolds/{id}` - Delete scaffold
- `PUT /api/scaffolds/{id}/activate` - Activate scaffold
- `PUT /api/scaffolds/{id}/deactivate` - Deactivate scaffold

### Run Control Management
- `GET /api/run-controls` - Get all run controls
- `GET /api/run-controls/{id}` - Get run control by ID
- `GET /api/run-controls/domain/{domainId}` - Get run controls by domain
- `GET /api/run-controls/execution-mode/{executionMode}` - Get by execution mode
- `GET /api/run-controls/holiday-calendar/{holidayCalendarId}` - Get by holiday calendar
- `POST /api/run-controls` - Create new run control
- `PUT /api/run-controls/{id}` - Update run control
- `DELETE /api/run-controls/{id}` - Delete run control
- `PUT /api/run-controls/{id}/activate` - Activate run control
- `PUT /api/run-controls/{id}/deactivate` - Deactivate run control

### Process Log Management
- `GET /api/process-logs` - Get all process logs
- `GET /api/process-logs/{id}` - Get process log by ID
- `GET /api/process-logs/run-control/{runControlId}` - Get logs by run control
- `GET /api/process-logs/run-control/{runControlId}/latest` - Get latest log
- `GET /api/process-logs/status/{status}` - Get logs by status
- `GET /api/process-logs/date-range` - Get logs by date range
- `POST /api/process-logs` - Create new process log
- `PUT /api/process-logs/{id}` - Update process log
- `DELETE /api/process-logs/{id}` - Delete process log

### UI Metadata Management
- `GET /api/ui-metadata` - Get all UI metadata
- `GET /api/ui-metadata/{id}` - Get UI metadata by ID
- `GET /api/ui-metadata/domain/{domainId}` - Get UI metadata by domain
- `GET /api/ui-metadata/source-object/{sourceObjectId}` - Get by source object
- `GET /api/ui-metadata/component-type/{componentType}` - Get by component type
- `POST /api/ui-metadata` - Create new UI metadata
- `PUT /api/ui-metadata/{id}` - Update UI metadata
- `DELETE /api/ui-metadata/{id}` - Delete UI metadata
- `PUT /api/ui-metadata/{id}/activate` - Activate UI metadata
- `PUT /api/ui-metadata/{id}/deactivate` - Deactivate UI metadata

### Dynamic Data Record Management
- `GET /api/dynamic-data-records` - Get all dynamic data records
- `GET /api/dynamic-data-records/{id}` - Get record by ID
- `GET /api/dynamic-data-records/domain/{domainId}` - Get records by domain
- `GET /api/dynamic-data-records/entity-type/{entityType}` - Get by entity type
- `GET /api/dynamic-data-records/approval-status/{approvalStatus}` - Get by approval status
- `POST /api/dynamic-data-records` - Create new record
- `PUT /api/dynamic-data-records/{id}` - Update record
- `DELETE /api/dynamic-data-records/{id}` - Delete record
- `PUT /api/dynamic-data-records/{id}/activate` - Activate record
- `PUT /api/dynamic-data-records/{id}/deactivate` - Deactivate record

### Version History Management
- `GET /api/version-history` - Get all version history
- `GET /api/version-history/{id}` - Get version history by ID
- `GET /api/version-history/entity/{entityId}` - Get history by entity ID
- `GET /api/version-history/entity-type/{entityType}` - Get history by entity type
- `GET /api/version-history/changed-by/{changedBy}` - Get history by user
- `GET /api/version-history/change-type/{changeType}` - Get history by change type
- `GET /api/version-history/date-range` - Get history by date range
- `POST /api/version-history` - Create version history record
- `POST /api/version-history/create` - Create with basic info
- `DELETE /api/version-history/{id}` - Delete version history

### Approval Management
- `GET /api/approvals` - Get all approvals
- `GET /api/approvals/{id}` - Get approval by ID
- `GET /api/approvals/entity/{entityId}` - Get approvals by entity ID
- `GET /api/approvals/entity-type/{entityType}` - Get approvals by entity type
- `GET /api/approvals/requested-by/{requestedBy}` - Get approvals by requester
- `GET /api/approvals/approved-by/{approvedBy}` - Get approvals by approver
- `GET /api/approvals/status/{status}` - Get approvals by status
- `GET /api/approvals/approval-type/{approvalType}` - Get approvals by type
- `GET /api/approvals/date-range` - Get approvals by date range
- `POST /api/approvals` - Create new approval
- `POST /api/approvals/request` - Create approval request
- `PUT /api/approvals/{id}/approve` - Approve request
- `PUT /api/approvals/{id}/reject` - Reject request
- `DELETE /api/approvals/{id}` - Delete approval

## Configuration

### Database Configuration
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/novaflow
    username: novaflow_user
    password: novaflow_password
```

### Server Configuration
- **Port**: 8081
- **API Documentation**: http://localhost:8081/swagger-ui.html
- **API Docs JSON**: http://localhost:8081/api-docs

## Getting Started

1. **Prerequisites**
   - Java 17 or higher
   - PostgreSQL database
   - Maven 3.6+

2. **Database Setup**
   - Create PostgreSQL database named `novaflow`
   - Run schema scripts from `novaflow-ui/postgresql/` directory
   - Ensure user `novaflow_user` has access

3. **Build and Run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **Access API Documentation**
   - Open http://localhost:8081/swagger-ui.html
   - View interactive API documentation and test endpoints

## Project Structure

```
src/main/java/com/novaflow/metadata/
├── NovaFlowMetadataApplication.java    # Main application class
├── config/                             # Configuration classes
│   ├── SwaggerConfig.java             # OpenAPI configuration
│   └── CorsConfig.java                # CORS configuration
├── controller/                         # REST controllers
│   ├── ConnectionController.java
│   ├── IntegrationObjectController.java
│   └── RuleController.java
├── entity/                            # JPA entities
│   ├── Connection.java
│   ├── IntegrationObject.java
│   ├── ObjectSchemaAttribute.java
│   ├── Rule.java
│   ├── RuleSet.java
│   ├── HolidayCalendar.java
│   └── Holiday.java
├── repository/                        # JPA repositories
│   ├── ConnectionRepository.java
│   ├── IntegrationObjectRepository.java
│   ├── RuleRepository.java
│   ├── HolidayCalendarRepository.java
│   └── ObjectSchemaAttributeRepository.java
├── service/                          # Business logic services
│   ├── ConnectionService.java
│   ├── IntegrationObjectService.java
│   └── RuleService.java
└── exception/                        # Exception handling
    └── GlobalExceptionHandler.java
```

## Entity Relationships

- **Connection** → **IntegrationObject** (One-to-Many)
- **IntegrationObject** → **ObjectSchemaAttribute** (One-to-Many)
- **IntegrationObject** → **Rule** (One-to-Many as source/target)
- **HolidayCalendar** → **Holiday** (One-to-Many)

## Development Notes

- All entities use Jackson annotations to prevent circular reference issues during JSON serialization
- Comprehensive validation using Bean Validation annotations
- Audit fields (created_by, created_date, etc.) are automatically managed
- Status fields use character codes ('A' for Active, 'I' for Inactive)
- Version fields support optimistic locking and change tracking

## Error Handling

The service includes comprehensive error handling for:
- Validation errors (400 Bad Request)
- Resource not found (404 Not Found)
- Data integrity violations (409 Conflict)
- Generic server errors (500 Internal Server Error)

## CORS Support

CORS is configured to allow requests from:
- http://localhost:3000 (React development)
- http://localhost:3001 (Alternative frontend)
- https://novaflow.com (Production frontend)
