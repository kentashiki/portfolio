"""Package contact-form changes and the private mail handler; never read credentials."""

import argparse
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


def main():
  root = Path(__file__).resolve().parents[1]
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument("--output", type=Path, default=root.parent / "portfolio-deploy" / "xserver-contact.zip")
  args = parser.parse_args()
  args.output.parent.mkdir(parents=True, exist_ok=True)
  private_files = ["app.php", "config.example.php", "phpmailer/Exception.php", "phpmailer/PHPMailer.php", "phpmailer/SMTP.php", "phpmailer/LICENSE", "phpmailer/README.md"]
  public_files = ["api/contact.php", "contact/index.html", "contact/contact.css", "contact/contact.js", "ja/contact/index.html"]
  with ZipFile(args.output, "w", ZIP_DEFLATED) as archive:
    for name in public_files:
      source = root / "public" / name
      if source.is_symlink():
        raise ValueError(f"Public files must not be symlinks: {source}")
      archive.write(source, Path("public_html") / name)
    for name in private_files:
      archive.write(root / "private/contact" / name, "private/contact/" + name)
    archive.write(root / "docs/contact-form.md", "SETUP.md")
  print(args.output.resolve())


if __name__ == "__main__":
  main()
