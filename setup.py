from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in pearl_pack/__init__.py
from pearl_pack import __version__ as version

setup(
	name="pearl_pack",
	version=version,
	description="this pearl pack",
	author="Safdar Ali",
	author_email="safdar211@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
