---

name: database
description: Design, review, and document Supabase PostgreSQL schemas, relationships, SQL planning, normalization, and Row Level Security for the attendance monitoring system. Use when working with database design or Supabase.
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Database Skill

## Goal

Plan database changes safely before implementation.

## Rules

* Never assume tables that do not exist.
* Ask for the current schema if unavailable.
* Preserve normalization where appropriate.
* Explain relationships before SQL.
* Identify primary keys and foreign keys.
* Consider indexing for frequently queried attendance data.

## Review Process

Analyze:

1. Existing tables
2. Relationships
3. Required new fields
4. Constraints
5. RLS impact
6. Query impact

## Output

Return:

* Entity analysis
* Table design
* Relationship explanation
* SQL proposal
* RLS considerations
* Migration risks
* Rollback considerations

Do not execute destructive SQL unless explicitly requested.
