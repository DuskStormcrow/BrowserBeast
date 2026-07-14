#!/usr/bin/env python3
"""Create the deterministic BrowserBeast v1.0 release ZIP."""

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


ROOT = Path(__file__).resolve().parent.parent
VERSION = "1.0"
PACKAGE_ROOT = f"BrowserBeast-v{VERSION}"
OUTPUT = ROOT / "dist" / f"BrowserBeast-v{VERSION}.zip"
RELEASE_LIST = ROOT / "RELEASE_FILES.txt"
FIXED_TIME = (2026, 1, 1, 0, 0, 0)


def release_files() -> list[Path]:
    entries = []
    for line in RELEASE_LIST.read_text(encoding="utf-8").splitlines():
        value = line.strip()
        if value and not value.startswith("#"):
            entries.append(Path(value))
    return entries


def main() -> None:
    files = release_files()
    missing = [str(path) for path in files if not (ROOT / path).is_file()]
    if missing:
        raise SystemExit("Missing release files:\n- " + "\n- ".join(missing))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(OUTPUT, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for relative in sorted(files, key=lambda path: path.as_posix()):
            info = ZipInfo(f"{PACKAGE_ROOT}/{relative.as_posix()}", FIXED_TIME)
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, (ROOT / relative).read_bytes())

    print(f"Created {OUTPUT}")


if __name__ == "__main__":
    main()
