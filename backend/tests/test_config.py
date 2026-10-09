import pytest

from backend.app.config import Settings


@pytest.mark.parametrize(
    ("database_url", "expected"),
    [
        (
            "postgres://user:password@host.example/db",
            "postgresql+psycopg://user:password@host.example/db",
        ),
        (
            "postgresql://user:password@host.example/db",
            "postgresql+psycopg://user:password@host.example/db",
        ),
        (
            "postgresql+psycopg://user:password@host.example/db",
            "postgresql+psycopg://user:password@host.example/db",
        ),
    ],
)
def test_database_url_uses_installed_psycopg_driver(database_url, expected):
    settings = Settings(_env_file=None, database_url=database_url)

    assert settings.database_url == expected


def test_database_url_preserves_sqlite_for_tests():
    settings = Settings(_env_file=None, database_url="sqlite:///test.db")

    assert settings.database_url == "sqlite:///test.db"
