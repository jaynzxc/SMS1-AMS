---

name: rbac
description: Plan and review role-based access control for Admin, Teacher, and Student users using frontend restrictions and Supabase Row Level Security. Use when implementing permissions, protected pages, or authorization.
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# RBAC Skill

## System Roles

* Administrator
* Teacher
* Student

Additional roles must not be invented unless requested.

## Workflow

1. Identify the actor.
2. Identify allowed actions.
3. Identify restricted actions.
4. Define frontend access.
5. Define backend authorization.
6. Review Supabase RLS requirements.
7. Test unauthorized access scenarios.

## Security Principle

Never rely only on hidden buttons or frontend routing.

Authorization must also be enforced in Supabase.

## Output

Always provide:

* Role matrix
* Permissions
* Restricted operations
* Frontend strategy
* Database strategy
* Security test cases
