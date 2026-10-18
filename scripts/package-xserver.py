"""Package the static site or Formspree contact pages for XServer."""

import argparse
from pathlib import Path
from tempfile import gettempdir
from zipfile import ZIP_DEFLATED, ZipFile


def main():
  root = Path(__file__).resolve().parents[1]
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument("--full-site", action="store_true", help="Include all public site files")
  parser.add_argument("--output", type=Path, help="ZIP destination (defaults to a temporary folder)")
  args = parser.parse_args()
  if args.output is None:
    filename = "xserver-portfolio.zip" if args.full_site else "xserver-formspree-contact.zip"
    args.output = Path(gettempdir()) / "portfolio-deploy" / filename
  public = root / "public"
  if args.output.resolve().is_relative_to(public.resolve()):
    parser.error("Place the ZIP outside public/ so it is not published or packaged into itself")
  args.output.parent.mkdir(parents=True, exist_ok=True)
  contact_files = ["contact/index.html", "contact/contact.css", "contact/contact.js", "contact/config.js", "ja/contact/index.html"]
  if args.full_site:
    sources = sorted(path for path in public.rglob("*") if not any(part.startswith(".") for part in path.relative_to(public).parts))
  else:
    sources = [public / name for name in contact_files]
  for source in sources:
    if source.is_symlink():
      raise ValueError(f"Public files must not be symlinks: {source}")
  with ZipFile(args.output, "w", ZIP_DEFLATED) as archive:
    for source in sources:
      if source.is_file():
        archive.write(source, Path("public_html") / source.relative_to(public))
    if not args.full_site:
      archive.write(root / "docs/contact-form.md", "SETUP.md")
  print(args.output.resolve())


if __name__ == "__main__":
  main()
