#!/usr/bin/env python3
"""
PDF to Images Converter
Extracts each page of a PDF file into separate image files.
"""

import argparse
import sys
from pathlib import Path

try:
    from pdf2image import convert_from_path
except ImportError:
    print("Error: pdf2image is not installed.")
    print("Install it with: pip install pdf2image")
    print("You also need poppler installed:")
    print("  - macOS: brew install poppler")
    print("  - Ubuntu: sudo apt-get install poppler-utils")
    print("  - Windows: Download from https://github.com/osber/poppler")
    sys.exit(1)


def pdf_to_images(
    pdf_path: str,
    output_dir: str = None,
    image_format: str = "png",
    dpi: int = 200,
    prefix: str = None
) -> list[Path]:
    """
    Convert a PDF file to images, one per page.

    Args:
        pdf_path: Path to the PDF file
        output_dir: Directory to save images (default: same as PDF)
        image_format: Output format - png, jpg, jpeg, tiff (default: png)
        dpi: Resolution of output images (default: 200)
        prefix: Prefix for output filenames (default: PDF filename)

    Returns:
        List of paths to created image files
    """
    pdf_path = Path(pdf_path)

    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    if not pdf_path.suffix.lower() == ".pdf":
        raise ValueError(f"File is not a PDF: {pdf_path}")

    # Set output directory
    if output_dir is None:
        output_dir = pdf_path.parent
    else:
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

    # Set filename prefix
    if prefix is None:
        prefix = pdf_path.stem

    # Convert PDF to images
    print(f"Converting: {pdf_path}")
    print(f"Output directory: {output_dir}")
    print(f"Format: {image_format.upper()}, DPI: {dpi}")

    images = convert_from_path(pdf_path, dpi=dpi)

    output_paths = []
    total_pages = len(images)

    for i, image in enumerate(images, start=1):
        output_filename = f"{prefix}_page_{i:03d}.{image_format}"
        output_path = output_dir / output_filename

        image.save(output_path, image_format.upper())
        output_paths.append(output_path)
        print(f"  Saved page {i}/{total_pages}: {output_filename}")

    print(f"\nDone! Extracted {total_pages} pages.")
    return output_paths


def main():
    parser = argparse.ArgumentParser(
        description="Convert PDF pages to individual images"
    )
    parser.add_argument(
        "pdf_path",
        help="Path to the PDF file"
    )
    parser.add_argument(
        "-o", "--output-dir",
        help="Output directory (default: same as PDF location)"
    )
    parser.add_argument(
        "-f", "--format",
        default="png",
        choices=["png", "jpg", "jpeg", "tiff"],
        help="Output image format (default: png)"
    )
    parser.add_argument(
        "-d", "--dpi",
        type=int,
        default=200,
        help="Image resolution in DPI (default: 200)"
    )
    parser.add_argument(
        "-p", "--prefix",
        help="Prefix for output filenames (default: PDF filename)"
    )

    args = parser.parse_args()

    try:
        pdf_to_images(
            pdf_path=args.pdf_path,
            output_dir=args.output_dir,
            image_format=args.format,
            dpi=args.dpi,
            prefix=args.prefix
        )
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
