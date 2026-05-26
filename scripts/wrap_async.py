"""
Wrap the data-consuming inline <script> in each HTML page so it awaits
window.TPEA_DATA_READY (the Promise exposed by the new CSV-based data.js)
before reading window.TPEA_DATA.

Each affected file looks like:

  <script>
  TPEA_LAYOUT.mount();
  const D = window.TPEA_DATA;
  ...
  </script>

This script transforms it into:

  <script>
  (async () => {
  TPEA_LAYOUT.mount();
  await window.TPEA_DATA_READY;
  const D = window.TPEA_DATA;
  ...
  })();
  </script>

Run from repo root:  python3 scripts/wrap_async.py
"""
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
FILES = [
    "browse.html", "search.html", "entry.html", "download.html",
    "painmodel.html", "help.html", "index.html",
]

# Marker we look for. Has to be exact so the patch is idempotent — if it's
# already wrapped, we'll match a different prefix and skip.
NEEDLE_HEAD = "TPEA_LAYOUT.mount();\nconst D = window.TPEA_DATA;"
REPLACE_HEAD = (
    "(async () => {\n"
    "TPEA_LAYOUT.mount();\n"
    "await window.TPEA_DATA_READY;\n"
    "const D = window.TPEA_DATA;"
)

# Detect the LAST </script> in the file (the page-level inline one we want
# to close). We close the IIFE right before it.
def patch(path: Path):
    text = path.read_text(encoding="utf-8")
    if "(async () => {\nTPEA_LAYOUT.mount();" in text:
        print(f"  - {path.name}: already wrapped, skipping")
        return
    if NEEDLE_HEAD not in text:
        print(f"  ! {path.name}: head marker not found, SKIPPING (manual fix required)")
        return

    # Replace the head only on its first occurrence (each file has one).
    new_text = text.replace(NEEDLE_HEAD, REPLACE_HEAD, 1)

    # Close the IIFE. We append "\n})();" right before the LAST </script>.
    idx = new_text.rfind("</script>")
    if idx < 0:
        print(f"  ! {path.name}: no </script> found, SKIPPING")
        return
    closed = new_text[:idx].rstrip() + "\n})();\n" + new_text[idx:]
    path.write_text(closed, encoding="utf-8")
    print(f"  ✓ {path.name}: wrapped")


def main():
    print("Wrapping data-using inline scripts in async IIFE:")
    for name in FILES:
        patch(REPO / name)
    print("Done.")


if __name__ == "__main__":
    main()
