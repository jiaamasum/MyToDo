# MyToDo (Django Learning Project)

MyToDo is a simple Django-based task manager built for learning purposes. It demonstrates templates, static files, and a basic UI for managing tasks with a focus on front-end polish.

## Project Structure
- `manage.py` – Django management entrypoint.
- `todo_main/` – Project settings and URLs.
- `templates/` – HTML templates (`home.html`, `edit_task.html`).
- `todo_main/static/` – CSS/JS assets.
- `db.sqlite3` – Default SQLite database (ignored in git).

## Requirements
- Python 3.11+ (matches the virtualenv in `env/`).
- pip for installing dependencies.

## Getting Started
1) Create/activate a virtual environment:
```bash
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate
```
2) Install dependencies:
```bash
pip install django
```
3) Apply migrations and run:
```bash
python manage.py migrate
python manage.py runserver
```
4) Visit http://127.0.0.1:8000 to view the app.

## Key Files
- `templates/home.html` – Lists tasks and completed tasks; includes modal markup and new-task form.
- `templates/edit_task.html` – Standalone edit form with custom styling (no JS needed).
- `todo_main/static/css/style.css` – Main styling for the dashboard UI.
- `todo_main/static/js/script.js` – Minimal modal handling (open/edit/save text).

## Notes
- Static files are served via Django’s staticfiles app; ensure `STATIC_URL` and `STATICFILES_DIRS`/`STATIC_ROOT` are configured in `settings.py`.
- Tasks should be provided by your Django views to the templates; JS is minimal and not responsible for persistence.
- The SQLite database (`db.sqlite3`) is ignored by git; migrations are not included by default.

## Future Ideas
- Wire CRUD actions to Django views/APIs.
- Add user auth and per-user task lists.
- Add tests for views/templates/static configuration.
