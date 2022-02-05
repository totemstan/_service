#!/bin/bash
# UNCLASSIFIED
#
# Totem maint script
# https://github.com:totemstan/totem/masters/maint.sh

HERE=`pwd`
MODULES=(totem atomic geohack ocr enums reader debe pipe jsdb man randpr liegroup securelink socketio)
MODULE=`basename $HERE`
SNAPSHOTS=/mnt/snapshots

case "$1." in

############################
# env setup
	############################

debe_config.)
	# specific geonode client
	export PUBLIC=./public					# public path
	export ADMIN=$HERE/admins 				# admin stuff, checkpoints
	export TEMP=$HERE/tmp/					# temp files
	export DB=$PUBLIC/dbs/					# training images
	export DETS=$PUBLIC/dets/ 				# trained detectors
	export PROOFS=$PUBLIC/cars/ver0/ 			# unmodulated/unrotated images for testing
	#export SCRIPTS=$HERE/clients/extjs/packages/ext-locale/build/ext-locale-
	export THEMES=$HERE/clients/themes
	
	#export TXMAIL_HOST=smtp.comcast.net:587
	#export TXMAIL_USER=brian.d.james:COMCASTsnivel1
	#export RXMAIL_HOST=
	#export RXMAIL_USER=
	
	export INDEX= #data/nlp.json  			# reader nlp indexing save path
	export SCAN=$HERE/node_modules/reader/jquery-1.7.1.min.js 	# web site scanners

	export XLATE=$HERE/node_modules/i18n-abide/examples/express3/i18n	# I18N translation folder
	export PATH=$PATH:$NODE/bin

	export REPO=http://github.com/totemstan
	export JIRA=http://jira.tbd
	export RAS=http://ras.tbd
	export BY=https://research.nga.ic.gov

	;;
	
geohack_config.)
	# IDOP conversion utilities
	export IVA=$BASE/iva
	export GDAL=$BASE/gdal
	#export IVA=/rroc/data/giat/iva			# IDOP conversion utilities
	;;
	
base_config.)
	export BASE=/local
	
	# initialize dev/prod paths
	export PATH=/local/bin:/usr/bin:/local/sbin:/usr/sbin:/local/cmake/bin
	#export GITUSER=totemstan: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
	#export REPO=https://$GITUSER@github.com/totemstan
	export REPO=https://github.com/totemstan

	# doc and dev tools
	#export PATH=/opt/cmake:$PATH 			# latest cmake
	#export PATH=$BASE/oxygen/bin:$PATH    	# doxygen code documenter if needed (jsduck used)
	#export PATH=$PATH:/usr/local/share/gems/gems/jsduck-5.3.4/bin 	# for jsduck

	# DBs
	export MYSQL=$BASE/mysql
	export NEO4J=$BASE/neo4j
	
	# Apps
	export RED=$BASE/nodejs/lib/node_modules/node-red
	export CESIUM=$BASE/cesium
	export OSM=$BASE/osm
	export CUDA=$BASE/cuda
	export CAFFE=$BASE/caffe
	export OPENCV=$BASE/opencv

	# R
	export R_libs=/usr/lib64/R/library/

	# NodeJS  
	export PATH=$PATH:$NODE/bin
	export NODE=$BASE/nodejs
	export NODELIB=$NODE/lib/node_modules
	export node_path=./node_modules

	# Python
	export CONDA=$BASE/anaconda
	export PYTHONHOME=$CONDA
	export PYTHONPATH=$BASE/caffe/python:$PYTHON/:$PYTHON/site-packages:$BASE/service/atomic
	
	;;
	
jsdb_config.)
	# MYSQL
	#export PATH=$MYSQL/bin:$PATH
	#export MYSQL_NAME=app
	#export MYSQL_USER=root
	#export MYSQL_HOST=localhost
	#export ODBC_NAME=totem-app
	#export ODBC_USER=ileuser

	# NEO4J
	#export NEO4J_HOST="bolt://localhost" # "http://root:NGA@localhost:7474"
	#export NEO4J_USER="neo4j"
	export URL_LEXNEX=https://services-api.lexisnexis.com/v1/
	;;
seclink_config.)
	export LINK_HOST=totem
	;;
	
totem_config.)
	# POCs
	#export ADMIN="admin_tbd@nga.mil"
	#export OVERLORD="overlord_tbd@nga.mil"
	#export SUPER="supervisor_tbd@nga.mil"

	# docker
	#export GPU="--device /dev/nvidia0:/dev/nvidia0 --device /dev/nvidiactl:/dev/nvidiactl --device /dev/nvidia-uvm:/dev/nvidia-uvm"
	#export VOL="--volume /local:/base --volume /home/jamesdb/installs:/installs --volume /usr/lib64:/usr/lib64"
	#export NET="--net host"
	#export RUN="run -it $GPU $VOL $NET"
	#export RUND="$RUN -d"

	# define user/password keys
	bash $BASE/service/totem/config/_pass.sh

	# define service url
	export URL_MASTER=http://localhost:8080
	export URL_WORKER=https://localhost:8081
	export URL_MYSQL=http://$KEY_MYSQL@localhost:3306
	export URL_NEO4J=http://$KEY_NEO4J@localhost:7474
	export URL_TXMAIL=http://$KEY_TXMAIL@smtp.comcast.net:587
	export URL_RXMAIL=
	export URL_LEXNEX=https:$KEY_LEXNEX//services-api.lexisnexis.com/v1/

	#export URL_WORKER=https://localhost:8443
	#export URL_WORKER=http://localhost:8081  # in debug mode

	# define service urls
	
	case "$(hostname)." in
		wsn3303.)
			DOMAIN=totem.nga.mil
			;;

		awshigh.)
			DOMAIN=totem.west.ile.nga.ic.gov
			;;

		ilehigh.)
			DOMAIN=totem.west.ile.nga.ic.gov
			;;

		acmesds.)
			DOMAIN=totem.hopto.org
			;;

		dockerhost.)
			DOMAIN=totem.hopto.org
			;;

		*)
			DOMAIN=unknown
	esac
	
	case "$2." in 
		prod.)	# multi core production
			PROTO=https
			PORT1=8080
			PORT2=443
			;;

		prot.)	# single core
			PROTO=https
			PORT1=8443
			PORT2=8080
			;;

		oper.)
			export SERVICE_OPER=yes
			DOMAIN=localhost
			PROTO=https
			PORT1=80
			PORT2=443
			;;
		
		*)
			DOMAIN=localhost
			PROTO=http
			PORT1=8080
			PORT2=8081
			;;
	esac
	
	# define service url
	export URL_MASTER=$PROTO://$DOMAIN:$PORT1
	export URL_WORKER=$PROTO://$DOMAIN:$PORT2
	
	echo "$LINK_HOST at $URL_MASTER and $URL_WORKER"
	
	# define task sharding urls
	export SHARD0=$PROTO://$DOMAIN/task
	export SHARD1=$PROTO://$DOMAIN/task
	export SHARD2=$PROTO://$DOMAIN/task
	export SHARD3=$PROTO://$DOMAIN/task

	;;
	
atomic_config.)
	# To link atomic with caffe, anaconda python, and opencv

	export CONDA=$BASE/anaconda
	export LIB=$BASE/lib64
	export NODE=$BASE/nodejs
	
	export PYLINK=$CONDA
	export PYTHON=$CONDA/bin/python2.7
	export PYTHONINC=$CONDA/include/python2.7
	export PYTHONLIB=$LIB/python/libpython2.7.so
	
	#export PYTHON=$CONDA/bin/python3.8
	#export PYTHONINC=$CONDA/include/python3.8
	#export PYTHONLIB=$LIB/python/libpython3.8.so
	
	# engine GPU compile switches
	case "$(hostname)." in
		awshigh.)  # AWS
			export GPUHOST=jamesdb@swag-gpu-01
			export GUIHOST=jamesdb@swag-ws-02
			export HASGPU=1
			export HASCAFFE=1
			;;

		ilehigh.) 	# ILE high
			export GPUHOST=giatstlgui01.innovision.local
			export GUIHOST=giatstlgui01.innovision.local
			export HASGPU=1
			export HASCAFFE=1
			;;

		wsn3303.)  # ILE low
			export GPUHOST=wsn3303
			export GUIHOST=wsn3303
			export HASGPU=1
			export HASCAFFE=1
			;;

		acmesds.)  # dev machine
			export GPUHOST=
			export GUIHOST=
			export HASGPU=0
			export HASCAFFE=0
			;;
			
		docker.)	# dockerized container
			export GPUHOST=
			export GUIHOST=
			export HASGPU=0
			export HASCAFFE=0
			;;
			
		*)
			export GPUHOST=
			export GUIHOST=
			export HASGPU=0
			export HASCAFFE=0
			;;
		
	esac
	
	# Dev paths
	export INC=$BASE/include
	export INCLUDE=$INC
	export PATH=$PATH:$INC/opencv:$BASE/opencv/bin
	export PATH=$CONDA/bin:$INC/python:$PATH
	export REBUILD="node-gyp rebuild --nodedir=$NODE"	# use "node-gyp $GYPTOPS" to override distro ref to inet

	# more dev paths
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB/opencv
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB/python
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB/jpeg
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB/R/R
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB/conda
	
	# caffe dev paths
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB/boost
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB/gflags
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB/glog
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB/lmdb
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB/leveldb
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB/hdf5
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB/cuda
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB/cuDNN
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB/caffe
	export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$LIB/protobuf
	;;

config.)
	source ./maint.sh base_config
	source ./maint.sh seclink_config
	source ./maint.sh jsdb_config
	source ./maint.sh totem_config $2
	
	source ./maint.sh atomic_config
	source ./maint.sh geohack_config
	source ./maint.sh debe_config
	;;

####################
# opencv
	# https://opencv.org/releases/
	# centos 6.x must install opencv-2.x globally (as setting caffe Makefile.config includes/libs does not work):
	# centos 7.x must install opencv-3.x from downdload (issues w 4.x)
	# make sure cuda-8.0 installed as opencv defaults to these
	####################
opencv_install.)
	mkdir $OPENCV; cd $OPENCV
	cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/local/opencv ..
	make   # may get 2 errors re gpu/cuda support - ignore them - wont use these modules yet
	sudo make install  # should install w/o errors - likely because it includes its own cuda drivers
	;;

##############
# nvidia
	# install gets tricky and not needed if no gpu
	##############
nvidia_install.)
	# .run vers hang so dont download latest .sh nvidia drivers and install
	# sh cuda_VER.run # run again - this time install only the drivers? - no! instead ...
	sudo yum clean all
	sudo yum -y module install nvidia-driver:latest-dkms
	sudo yum -y install cuda

	cd $CUDA/samples
	make    # will take 20mins 
	cd /bin/x86_64/linux/release
	./deviceQuery   # better work
	./bandwidthTest	 # insightful info
	;;

##############
# cuda install for GPU support (used by opencv, caffe, etc)
	# https://developer.nvidia.com/cuda-11.0-download-archive?target_os=Linux&target_arch=x86_64&target_distro=CentOS&target_version=8&target_type=rpmlocal
	# https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html
	# cuda-nvidia compatibility: https://developer.nvidia.com/cuda-gpus
	# https://developer.nvidia.com/da-downloads?target_os=Linux&target_arch=x86_64&target_distro=CentOS&target_version=7&target_type=rpmlocal
	# toolkit 10/11 installs cuda-8 (earlier vers install cuda-7/6)
	# downloads + guide: https://docs.nvidia.com/cuda/archive/11.5.0/
	#
	# K5000 compatibile with cuda 5.0 +
	# cuda toolket 11.0.2 contains cuda 8
	############## 
cuda_install.)
	# .run versions typically hang so use the rpm install
	# sh cuda_VER.run 	# dont install the nvidia drivers - only the toolkit
	yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm

	sudo rpm -i cuda-repo-rhel8-11-0-local-11.0.2_450.51.05-1.x86_64.rpm
	sudo yum clean expire-cache
	# sudo yum install nvidia-driver-latest-dkms  # dont install - but this may be cause of cuda not installing w/o vulcan
	sudo yum install cuda
	sudo yum install cuda-drivers
	;;

_ospkg.)
	# one-time yum patch on the online centos
	# yum install yum-plugin-downloadonly yum-utils createrepo 

	## from the "online" centos that is building the s/a R rpm

	mkdir /var/tmp/$2
	mkdir /var/tmp/$2-installroot

	# Download the RPMs. This uses the installroot trick suggested here to force a full download of 
	# all dependencies since nothing is installed in that empty root. Yum will create some metadata in 
	# there, but we're going to throw it all away. Note that for CentOS7 releasever would be "7".

	yum install --downloadonly --installroot=/var/tmp/$2-installroot --releasever=7 --downloaddir=/var/tmp/$2 $2

	# Generate the metadata needed to turn our new pile of RPMs into a YUM repo and clean up the stuff 
	# we no longer need:

	createrepo --database /var/tmp/$2
	rm -rf /var/tmp/$2-installroot

	# Configure the download directory as a repo. Note that for CentOS7 the gpgkey would be 
	# named "7" instead of "6": 

	cp pkgrepo /etc/yum.repos.d/offline-$2.repo
	sed "s/PKG/$2/g" /etc/yum.repos.d/offline-$2.repo
	echo "revise /etc/yum.repos.d/offline-$2.repo"
	
	# check for missing dependencies:
	repoclosure --repoid=offline-$2

	# make the s/a repo
	zip -r $2.zip /var/tmp/$2/
	;;

_all.)

	for mod in "${MODULES[@]}"; do

		cd /local/service/$mod
			if test -f maint.sh; then
				echo ">>>> $mod"
				bash ./maint.sh "$2" "$3" "$4"
			fi
		cd ..

	done
	;;

_clearall.)   # reset env

	for mod in "${MODULES[@]}"; do
		let Totem_$mod=0
	done
	;;

_config.)
	if test -f ./config.sh; then
		bash ./config.sh
	fi
	;;
	

############################
# flatten/expand files for domain xfer
	############################
flatten.)
	echo "flattening $2/* -> $2.tar -> $2.hex -> F_$2_xx*"
	tar cvf $2.tar $2 --exclude=.git
	xxd -p $2.tar $2.hex
	split -b 10m $2.hex F_$2_$xx
	rm $2.tar
	rm $2.hex
	#mkdir patches/$2
	#mv $2_$xx* patches/$2
	;;

expand.)
	echo "expanding F_$2_$xx* -> $2.hex -> $2.tar -> $2/*"
	#cp patches/$2/* .
	cat F_$2* > $2.hex
	xxd -r -p $2.hex  $2.tar
	tar xvf $2.tar
	rm $2.tar
	rm $2.hex
	rm F_$2*
	;;

############################
# Starters
	############################
start.)
	case "$2." in
		dbs.)
			bash ./maint.sh mysql start
			bash ./maint.sh neo4j start
			;;

		apps.)
			bash ./maint.sh nodered start
			bash ./maint.sh cesium start
			bash ./maint.sh osm start
			#acroread 			# starts adobe reader for indexing pdfs.  
			#openoffice4 		# starts openoffice server for indexing docs.  
			;;
		
		net.)
			sudo systemctl stop firewalld	# if running in host os
			;;

		docker.)		# status and start dependent services
			bash ./maint.sh docker start
			;;

		all.)
			bash ./maint.sh start dbs
			bash ./maint.sh start apps
			;;
	esac
	;;

############################
# Google CSE (Custom Search Engine) API key
		# https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyBp56CJJA0FE5enebW5_4mTssTGaYzGqz8&cx= 017944666033550212559:xrgqwdccet4&q=walmart
		# key: AIzaSyAIP4VvzppRtiz0MvZ1WxTLG8s_Zw5T2ms
		# accounts: nowhere stan / nowhere1234 / mepila7915@lege4h.com
	############################
google_config.)
	;;

############################
# CENTOS 7.7 os
	############################
os_update.)
	# win Map Drive
	if [ 1 ]; then
		echo "net use T: \\localhost\c$\Users\X\Desktop\totem"
	fi

	# os update
	if [ 1 ]; then
		yum install -y epel-release
		sudo yum -y update			# bring OS uptodate
		sudo yum -y groupinstall "Development Tools"
		sudo yum -y install kernel-devel kernel-headers dkms cmake
	fi
	
	# tiger vnc remote login
	# DO NOT install VNC if nvidia-GPU drivers installed
	if [ ]; then
		sudo nvidia-xconfig	# this no longer needed if -noopengl used
		vi /etc/X11/xorg.conf
		# add 'Load "glx"' to 'Section "Module"'
		sudo yum install tigervnc xrdp
		sudo yum group install "X Window System" "gnome desktop"
		sudo systemctl enable gdm
		sudo systemctl set-default graphical.target
		sudo yum install tigervnc-server
		sudo rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
		sudo systemctl enable xrdp.service
		vi /etc/systemd/system/vncserver@:1.service
		# replace 2 <USER> tokens with <account> name
		# ExecStart = /sbin/runuser -l <account> -c "/usr/bin/vncserver %i -geometry"
		sudo systemctl start vncserver@:1.service

		vi /etc/xrdp/xrdp.init
		# ip = 127.0.0.1
		# port = 5901
		sudo systemctl start xrdp

		echo -e "\nhald_enable='YES'\ndbus_enable='YES'" | sudo tee -a /etc/rc.conf
	fi

	# vscode editor
	# https://code.visualstudio.com/docs/setup/linux
	if [ 1 ]; then 
		sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
		sudo sh -c 'echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo'
		sudo yum install code
	fi
	
	# notepadqq editor
	# https://www.javatpoint.com/how-to-install-notepadqq-on-centos
	if [ ]; then
		wget -O /etc/yum.repos.d/sea-devel.repo http://sea.fedorapeople.org/sea-devel.repo
		yum install notepadqq
	fi

	# gnome desktop
	if [ ]; then
		yum -y groups install "GNOME Desktop"
		gsettings set org.gnome.desktop.session idle-delay 0
		gsettings set org.gnome.desktop.lockdown disable-lock-screen 'true'
		startx
	fi
	
	# nodejs addons
	# https://nodejs.org
	if [ 1 ]; then
		cd $BASE
		wget "..."
		tar xvf NODEJS
		npm install -g node-gyp
		npm install -g forever
		npm install -g node-red
		npm install -g phantomjs
		npm install -g @babel/core @babel/cli @babel/preset-env
	fi
	;;

############################
# totem data protector
	############################
totem.)
	case "$2." in
		# Install all Totem dependencies
		install.)
			mkdir -p $BASE/service; cd $BASE/service
			for mod in "${MODULES[@]}"; do
				echo "installing $mod"
				git clone $REPO/$mod
			done
			echo "Save your revised account:password keys to config/_pass.sh" 
			vi totem/pass.sh &
			;;

		# Update all Totem dependencies
		update.)
			for mod in "${MODULES[@]}"; do
				echo "updating $mod"
				cd $BASE/service/$mod
				git pull agent master
			done
			;;


		# Nodejs C bindings to Python,R,opencv,etc
		rebuild.)
			IFS=$BASE/service/atomic/ifs
			cd $IFS/opencv; $REBUILD
			cd $IFS/python; $REBUILD
			cd $IFS/mac; $REBUILD
			#cd $SRV/jslab
			#npm install node-svd
			#cd $SRV/glwip
			#npm install lwip
			;;

	esac
	;;
	

############################
# pcsc smart card reader
	# http://ludovic.rousseau.free.fr/softwares/pcsc-tools/
	# https://www.cac.mil/Common-Access-Card/CAC-Security/
	# https://cardwerk.com/smart-card-standard-iso7816-4-section-6-basic-interindustry-commands/
	# https://neapay.com/post/read-smart-card-chip-data-with-apdu-commands-iso-7816_76.html
	# https://stackoverflow.com/questions/40663460/use-apdu-commands-to-get-some-information-for-a-card
	# https://marcioreis.pt/how-to-communicate-with-a-smartcard-reader-using-node-js/
	# https://www.npmjs.com/package/smartcard
	# https://www.npmjs.com/package/pcsclite
	# https://superuser.com/questions/1386130/linux-how-can-i-display-and-import-the-certificates-delivered-by-smart-card-re
	# https://tldp.org/HOWTO/pdf/Smart-Card-HOWTO.pdf
	# https://militarycac.com/linux.htm
	# https://github.com/OpenSC/OpenSC/wiki
	# https://github.com/OpenSC/OpenSC/wiki/US-PIV
	# https://www.beyondtrust.com/docs/ad-bridge/how-to/integration/smart-card-setup.htm
	# https://en.wikipedia.org/wiki/Common_Access_Card
	# https://csrc.nist.gov/projects/piv
	# https://www.mankier.com/1/pkcs11-tool#Examples
	# https://docs.equinix.com/en-us/Content/Edge-Services/SmartKey/kb/SK-open-ssl.htm
	# https://manpages.debian.org/testing/opensc/pkcs11-tool.1.en.html
	############################
cac.)
	case "$2." in
		install.)
			# enable SCM MicrosoftSystems USB from vmbox

			yum install pcsc-lite pcsc-lite-devel pcsc-tools
			npm install pcsclite smartcard --save   # install nodejs i/f from service/totem
			pcscd  # start the daemon
			systemctl enable pcscd	# autorun it on boot

			# install opensc tools (pkcs11, opensc, etc) on laptop per https://github.com/OpenSC/OpenSC/wiki
			tar xfvz opensc-*.tar.gz
			cd opensc-*
			./bootstrap
			./configure --prefix=/local --sysconfdir=/local/config_opensc
			make
			sudo make install
			;;

		demo.)
			# shows certs on PIV cac
			pkcs11-tool -O   
			pkcs11-tool --type cert --id 01 --read-object --output-file cert.der  # dump auth cert at id=01 to cert.der
			openssl x509 -inform der -in cert.der -outform pem -out cert.pem

			#To sign some data stored in file data using the private key with ID ID and using the RSA-PKCS mechanism:
			pkcs11-tool --sign --id ID --mechanism RSA-PKCS --input-file data --output-file data.sig
			;;
	esac
	;;

############################
# openlayers openstreetmap
	# https://github.com/openlayers
	# https://openlayers.org/en/latest/doc/tutorials/bundle.html
	############################
osm.)
	case "$2." in
		start.)
			cd $OSM
			npm start
			;;

		install.)
			# Create a new empty directory for your project and navigate to it by running mkdir new-project && cd new-project. Initialize your project with
			# You will need to have git installed. If you receive an error, make sure that Git is installed on your system.
			# This will install the ol package, set up a development environment with additional dependencies, and give you an index.html and main.js starting point for your application. By default, Vite will be used as a module loader and bundler. See the create-ol-app documentation for details on using another bundler.

			mkdir -p $OSM; cd $OSM
			npx create-ol-app
			;;
	esac
	;;

############################
# neo4j computing
	# https://neo4j.com/docs/operations-manual/current/installation/linux/
	# https://www.oracle.com/java/technologies/downloads/
	# https://www.oracle.com/java/technologies/downloads/archive/
	# https://neo4j.com/developer/docker-run-neo4j/
	############################
neo4j.)
	case "$2." in
		install.)
			# download latest at https://neo4j.com/download-center/
			# Extract the contents of the archive, using tar -xf <filename>
			# Refer to the top-level extracted directory as: NEO4J_HOME
			#
			# To create login:  CALL dbms.security.createUser('USER', 'PASSWORD');
			#
			# Use need the neo4j-driver nodejs connector (dont use the node-neo4j connector).
			# Note neo4j 3.x needs java SE 8 installed, whereas neo4j 4.x needs SE 11.
			# To update 8 to 11 see https://sysadminxpert.com/steps-to-upgrade-java-8-to-java-11-on-centos-7/
			# or get standalone 11 from https://www.oracle.com/java/technologies/javase-jdk11-downloads.html

			mkdir -p $NEO4J; cd $NEO4J
			VER=3.5.15
			wget https://neo4j.com/artifact.php?name=neo4j-community-$VER-unix.tar.gz
			;;

		start.)
			$NEO4J/bin/neo4j console &
			;;

	esac
	;;

#################
# caffe install
	# https://caffe.berkeleyvision.org/install_yum.html
	#################
caffe.)
	# install caffe dependencies
	sudo yum install atlas-devel protobuf-devel leveldb-devel snappy-devel boost-devel hdf5-devel gflags-devel glog-devel lmdb-devel python-devel
	# sudo yum install blas-devel	# blas install centos 6.x only
	# may have to uninstall conda probuf etc
	
	# so caffe install in NEW TERMINAL - python 2.7? 
	# may have to uninstall conda protobuf etc

	unzip caffe-master
	mv caffe-master caffe
	cd caffe
	cp Makefile.config.example Makefile.config
	vi Makefile.config  &
	echo adjust ...\
	   > CPU_ONLY := 0 # 1 if gpu-less laptop\
	   > USE_OPENCV := 1\
	   > USE_CUDNN := 1\
	   > USE_LMDB := 1\
	   > USE_LEVELD := 1\
	   > CUDA_DIR := /local/cuda\
	   > OPENCV_VERSION := 3\
	   > ANACONDA_HOME := /local/anaconda\
	   > PYTHON_LIB := /local/anaconda/lib\
	   > BLAS_INCLUDE := /local/atlas/include \
	   > BLAS_LIB := /local/atlas/lib64

	vi Makefile # replace cblas -> satlas and altas -> tatlas on all LIBRARIES += lines

	# setup paths
	#export BASE=/local
	#export CONDA=/local/anaconda
	#export LIB=/local/lib64

	export PATH=/local/oxygen/bin:/opt/cmake:/local/anaconda/bin:/local/include/python:/opt/cmake:/local/mysql/bin:/local/bin:/usr/bin:/local/sbin:/usr/sbin:/local/nodejs/bin:/usr/local/share/gems/gems/jsduck-5.3.4/bin:/local/include/opencv:/local/opencv/bin:/local/nodejs/bin

	make clean
	make all   # some glog and boost warnings generated
	make test  # may get a few 'undefined ref to regexec'
	make runtest     

	# note during the make, INCLUDE_DIRS should look something like /local/atlas/include:/local/anaconda/bin:/local/include/python:/local/oxygen/bin:/opt/cmake:/local/anaconda/bin:/local/include/python:/local/oxygen/bin:/opt/cmake:/local/mysql/bin:/local/bin:/usr/bin:/local/sbin:/usr/sbin:/usr/local/share/gems/gems/jsduck-5.3.4/bin:/local/nodejs/bin:/local/include/opencv:/local/opencv/bin:/local/nodejs/bin:/local/include/opencv:/local/opencv/bin

	# python interface
	cd /local/caffe
	make pycaffe

	# we need python protobuf too (undocumented reqt)
	cd /local/anaconda/bin
	./pip install protobuf    # use conda's version so it installs to conda's site pkgs

	# most of this may not be needed as it is provided by anaconda
	cd caffe/python
	for req in $(cat requirements.txt); do pip install $req; done    # some errors are generated
	;;

############################
# R computing
	############################
R_install.)
	# R packages are available in the EPEL repositories. 
	# If you don’t have EPEL repository installed on your machine you can do it by typing:
	# sudo -y yum install epel-release

	sudo yum install R

	# R is a meta package that contains all the necessary R components.
	# Verify the installation by typing the following command which will print the R version:

	R --version
	;;

############################
# conda computing
	# https://www.anaconda.com/products/individual
	# https://docs.anaconda.com/anaconda/install/linux/
	# https://repo.anaconda.com/archive/
	############################
conda.)
	case "$2." in
		install.)
			mkdir $CONDA; cd $CONDA
			VER=3-2020.11
			# bash Anaconda$VER-Linux-x86_64.sh -b -p /local/anaconda3-2020.11

			echo "Install under $CONDA"
			sh Anaconda$VER-Linux-x86_64.sh
			conda init   # post install init
			
			conda install -c plotly plotly  # install plotly etc packages
			conda install -c anaconda mysql-connector-python	# install python connector
			conda install -c anaconda mysql-connector-python 
			conda install -c anaconda numpy
			conda install -c anaconda pillow 
			pip install pyminifier # --index-url= ..... (see gitadv)

			rm Anaconda$ver-Linux-x86_64.sh
			ln -s anaconda anaconda-$VER
			;;

		update.)
			##### install spacy
			if [ 1 ]; then
				python -m pip install -U socketIO-client
				# installs: socketIO-client requests six websocket-client idna certifi chardet urllib3
			fi

			#### smop matlab to python compiler
			if [ ]; then
				# download smop-master.zip
				unzip smop-master
				cd smop-master
				python setup.py install --user
				# to test
				cd smop
				python main.py smop solver.m
			fi
			;;

		start.)
			$CONDA/bin/jupyter-notebook --ip 0.0.0.0 --port 8081
			;;
	esac
	;;

readme.)
	repo1="https:\/\/github.com\/totemstan\/"
	repo2="https:\/\/gitlab.west.nga.ic.gov\/acmesds\/"
	repo3="https:\/\/sc.appdev.proj.coe\/acmesds\/"
	site1="http:\/\/totem.hopto.org\/"
	site2="https:\/\/totem.nga.mil\/"
	site3="https:\/\/totem.west.ile.nga.ic.gov\/"
	
	pass1="s/REPO{\([^}]*\)}/("$repo1"\1) || [COE]("$repo3"\1) || [SBU]("$repo2"\1)/g"
	pass2="s/SITE{\([^}]*\)}/("$site1"\1) || [COE]("$site3"\1) || [SBU]("$site2"\1)/g"
	
	#echo $pass1
	#echo $pass2
	
	sed "$pass1" readme.md | sed "$pass2" > README.md
	;;
	

############################
# mysql database
	# https://dev.mysql.com/downloads/cluster/
	# https://dev.mysql.com/doc/refman/5.7/en/data-directory-initialization.html
	############################
mysql.)
	case "$2." in
		install.)

			tar xvf MYSQL # cluster (7.3.6, 7.4.8, 7.5.5) from generic linux install package (not the .el versions)
			ln -s MYSQL  mysql

			# add missing english errmsg.sys
			cd mysql
			mkdir bin/share
			cp share/english/errmsg.sys bin/share
			cp share/english/errmsg.sys share/


			# revise my.cnf as follows
			cd mysql
			vi my.cnf  # add following
			[mysqld_safe]
			datadir=/local/sqldb
			basedir=/local/mysql
			socket=/tmp/mysql.sock
			symbolic-links=0
			log-error=/local/sqldb/mysqld.log
			pid-file=/local/sqldb/mysqld.pid
			sql-mode= 
			max_allowed_packet=64000000

			# create / initialize the sqldb 
			cd mysql
			./bin/mysqld --initialize-insecure --user=mysql  --basedir=/local/mysql --datadir=/local/sqldb
			./bin/mysqld_safe --defaults-file=my.cnf &
			./bin/mysql -u root --skip-password
			alter user "root"@"localhost" identified by "ROOTPASS"; # instead of using mysqladmin
			set global sql_mode = "";  # if preferred over mysql_safe startup 

			# start the mysql
			./bin/mysqld_safe --defaults-file=my.cnf &

			# prime the database ...
			mysql -uroot -pROOTPASS
			create database openv;
			create database app;
			exit		
			;;
			
		config.)	# tune dbs
			echo -e "update dbs as needed"
			mysql -u$MYSQL_USER -p$MYSQL_PASS -h$MYSQL_HOST
			;;

		snap.)		# snapshot all dbs
			mysqldump -u$MYSQL_USER -p$MYSQL_PASS -h$MYSQL_HOST openv >admins/openv.sql
			mysqldump -u$MYSQL_USER -p$MYSQL_PASS -h$MYSQL_HOST -R app >admins/app.sql
			mysqldump -u$MYSQL_USER -p$MYSQL_PASS -h$MYSQL_HOST -ndtR app >admins/funcs.sql
			;;

		prime.)		# prime totem
			mysql -u$MYSQL_USER -p$MYSQL_PASS -h$MYSQL_HOST openv <admins/openv.sql	
			mysql -u$MYSQL_USER -p$MYSQL_PASS -h$MYSQL_HOST app <admins/app.sql	
			mysql -u$MYSQL_USER -p$MYSQL_PASS -h$MYSQL_HOST app <admins/funcs.sql	
			;;

		start.)
			if P=$(pgrep mysqld); then
				echo -e "mysql service running: \n$P"
			else
				#rm /var/lib/mysql/mysql.sock      # in case its hanging around
				rm /tmp/mysql.sock.lock
				$MYSQL/bin/mysqld_safe --defaults-file=$MYSQL/my.cnf --sql-mode="" --max_allowed_packet=64000000 &
			fi
			;;
	esac
	;;

############################
# Archival
	############################
snap.)
	case "$2." in
		db.)
			mysqldump -u$MYSQL_USER -p$MYSQL_PASS -h$MYSQL_HOST openv >$SNAPSHOTS/sqldbs/openv.sql
			mysqldump -u$MYSQL_USER -p$MYSQL_PASS -h$MYSQL_HOST -R app --ignore-table=app.gtd >$SNAPSHOTS/sqldbs/app.sql
			mysqldump -u$MYSQL_USER -p$MYSQL_PASS -h$MYSQL_HOST -ndtR app >$SNAPSHOTS/sqldbs/funcs.sql
			;;

		srv.)
			cd /$BASE/service
			for mod in "${MODULES[@]}"; do
				echo "snapping $map"
				zip -ry $SNAPSHOTS/totem.zip $mod -x $mod/node_modules/\* $mod/.git/\* $mod/\*/.git/\* $mod/_\* $mod/~\* $mod/math/\* $mod/mljs/\* $mod/prm/\*
			done
			#zip $MAP/archives/snap.zip */*.js */README* */*.sh debe/uis/* debe/admins/*/* debe/public/*/* totem/certs/* atomic/ifs/*.cpp atomic/ifs/*/*.cpp atomic/ifs/*/*.h
			;;

		map.) 
			cd /$BASE
			zip $SNAPSHOTS/local_map.zip include/* include/R/* lib64/* lib64/R/*
			;;

		all.)
			bash ./maint.sh snapdb
			bash ./maint.sh snapsrv
			bash ./maint.sh snapmap
			;;
			
		minback.)
			cd $BASE/service
			for mod in "${MODULES[@]}"; do
				zip -ry /local/archive/totem/$mod.zip ./$mod/* -x \*/_\* /debe/captcha\* /debe/clients\* /debe/config/stores\* \*/.git* \*/node_modules/\*
			done
			;;

		nogitarch.)
			cd $BASE/service
			for mod in "${MODULES[@]}"; do
				echo "ziping $mod"
				zip -ry /local/archive/snapshot/$mod ./$mod/* -x \*/_\* /debe/captcha\* /debe/clients\* /debe/config/stores\* \*/.git* 
			done
			;;
	esac
	;;

############################
# cesium
	############################
cesium.)
	case "$2." in
		start.)
			if P=$(pgrep cesium); then
				echo -e "cesium service running: \n$P"
			else
				#node $BASE/cesium/geonode/geocesium --port 8083 --public &
				#node $BASE/cesium/server --port 8083 --public &
				node $CESIUM/server.cjs --port 8083 --public &
			fi
			;;
	esac
	;;

nodered.)
	case "$2." in
		start.)
			if P=$(pgrep node-red); then
				echo -e "nodered service running: \n$P"
			else
				#node $BASE/nodered/node_modules/node-red/red &
				node $RED/red -s $RED/settings.js &
			fi
			;;
	esac
	;;

############################
# docker
	# https://docker-curriculum.com/
	# https://docs.docker.com/engine/reference/commandline/build/
	# https://stackify.com/docker-build-a-beginners-guide-to-building-docker-images/
	# docker pull busybox
	# docker pull centos:7.8.2003
	# docker run -it ed6357ba5623 sh
	# python app example
	# https://docs.docker.com/compose/gettingstarted/
	# docker build -t acmesds/totem .
	# docker run -it ed6357ba5623 sh 
	############################
docker.)
	case "$2." in
		install.)
			mkdir -p $BASE/temp; cd $BASE/temp
			# download and execute install script from the Docker team
			wget -qO- https://get.docker.com/ | sh
			# add your user to the docker group
			sudo usermod -aG docker $(whoami)
			# Set Docker to start automatically at boot time
			sudo systemctl enable docker.service

			bash doc.sh docker start
		;;

		start.)
			# probe to expose /dev/nvidia device drivers to docker
			# $BASE/nvidia/bin/x86_64/linux/release/deviceQuery

			sudo systemctl start docker.service
			docker images
			docker ps -a
			;;
		esac
	;;

pubmake.)
	export BOOKS=(regress demo cints)
	for book in "${BOOKS[@]}"; do
		echo "publish $book"
		curl http://localhost:8080/$book.pub -o /dev/null
	done
	for book in "${BOOKS[@]}"; do
		echo "readme $book"
		curl http://localhost:8080/$book.tou -o .pubgit/$book/README.md
		cd ./pubgit/$book
		git push agent master
		cd ../..
	done
	;;

pubprime.)
	export BOOKS=(regress demo cints)
	for book in "${BOOKS[@]}"; do
		echo "prime $book"
		mkdir ./pubgit/$book
		cd ./pubgit/$book
		git init
		touch README.md
		git add README.md
		git remote add origin https://github.com/totemstan/book_$book
		cd ../..
	done
	;;
	

# legacy

_dbrecover.)
	bash ./maint.sh mysql prime
	;;

_restyle.)
	echo "to be developed"
	;;

_prmgen.)	# legacy codedoc gen

	documentation build prm_*.js -f html -o prm -c /local/docconfig.json
	;;
	
_prmput.)	# legacy jsduck host
	
	cd /local/babel
	npm run $MODULE      # use babel to convert ES6 to ES5 saves to jsduck area
	cd /local/service/$MODULE
	#cp README.md $DUCK/readmes/$MODULE.md
	echo "uploaded $MODULE to jsduck host"
	;;

_prmget.)	# legacy jsduck host
	cd /local/service/$MODULE
	cp -r /mnt/installs/jsduck/output/$MODULE/* prm
	echo "downloaded jsduck output into $MODULE/prm"
	;;
		
_duckpush.)
	# doxygen config.oxy
	bash ./maint.sh putduck totem
	;;

_duckpull.)
	cd /local/babel
	duckpull totem
	duckpull debe
	duckpull enum
	;;

_docall.)
	for mod in "${MODULES[@]}"; do

		echo ">>>> $mod"
		bash ./maint.sh doc "$mod"1 "$mod"2

	done
	;;
	
proxy.)	# establish email proxy
	ssh jamesdb@54.86.26.118 -L 5200:172.31.76.130:8080 -i ~/.ssh/aws_rsa.pri	
	;;
		
_nada.)	# quite mode
	;;

_notes.) 		# centos install notes
	vi notes.txt
	;;
	
_bind.) 	# rebind atomic engines

	cd $ENGINES/opencv
	node-gyp rebuild $GYPOPTS
	
	cd $ENGINES/python
	node-gyp rebuild $GYPOPTS
	
	cd $ENGINES/mac
	node-gyp rebuild $GYPOPTS

	cd $ENGINES
	node-gyp rebuild $GYPOPTS
	;;

_archive.) 	# archive service to archive area

	echo "Archiving to $MAP/snapshots"
	
	#rm $MAP/snapshots/totem.zip
	#zip -ry $MAP/snapshots/totem.zip * -x */node_modules/\* */.git/\* _\* ~\*
	#zip -ry $MAP/snapshots/totem.zip atomic -x atomic/.git/\* atomic/node_modules/\*	
	;;

############################
# git Local and remote archives
	############################
git.)
	case "$2." in
		install.)
			sudo yum install git
			;;

		genkey.) 		# make pub-pri key for git auto-password agent 
			echo "store keys under .ssh/git_totemstan_rsa and upload git_totemstan_rsa.pub key to git account." 
			echo "git remote add agent git@github.com:totemstan/REPO"
			ssh-keygen -t rsa -b 4096 -C "brian.d.james@comcast.com"
			;;

		agent.)		# start ssh agent
			eval $(ssh-agent -s)
			ssh-add ~/.ssh/git_totemstan_rsa
			;;

		config.)
			git config --global http.sslVerify false
			;;

		_gitzip.)
			zip -ry ../transfer/$MODULE.zip * -x \*/node_modules/\* \*/_\* \*/debe/captcha\* \*/debe/clients\*
			;;
	esac
	;;

help.)	# some help
	echo "Usage:"
	echo "	. maint.sh CMD OPTIONS"
	echo "	. maint.sh docker N FILE.js OPTIONS"
	echo "	. maint.sh CONFIG OPTIONS"
	echo "	. maint.sh FILE.js OPTIONS"
	;;

netrestart.)
	sudo /etc/init.d/network restart
	;;

admin.|lab.)  	# start totem
	case "$SERVICE_OPER." in 
		yes.)
			sudo -E env "PATH=$PATH" env "LD_LIBRARY_PATH=$LD_LIBRARY_PATH" forever -o debe.log start debe.js $1 $2 $3 $4 $5
			;;
		
		*)
			node debe.js $1 $2 $3 $4 $5 
			;;
	esac

esac

# UNCLASSIFIED
