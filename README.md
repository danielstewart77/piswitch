# piswitch
raspberry pi node.js gpio api

http://www.robert-drummond.com/2013/05/08/how-to-build-a-restful-web-api-on-a-raspberry-pi-in-javascript-2/
http://www.robert-drummond.com/2015/06/01/rest-api-on-a-pi-part-2-control-your-gpio-io-ports-over-the-internet/

git clone git://github.com/quick2wire/quick2wire-gpio-admin.git
cd quick2wire-gpio-admin
make
sudo make install
sudo adduser $USER gpio

quick2wire-gpio-admin/src/gpio-admin.c
from: int size = snprintf(path, PATH_MAX, "/sys/devices/virtual/gpio/gpio%u/%s", pin, filename);
to: int size = snprintf(path, PATH_MAX, "/sys/class/gpio/gpio%u/%s", pin, filename);
