#!/bin/bash

MYSQL_USER="root"
MYSQL_PASS="root"
MYSQL_HOST="localhost"
MYSQL_PORT="3306"
MYSQL_DOCK="mysqlhost"

NEO4J_USER="neo4j"
NEO4J_PASS="neo4j"
MYSQL_HOST="localhost"
NEO4J_PORT="7474"
NEO4J_DOCK="neo4jhost"

OS_DOCK="oshost"

TOTEM_DOCK="totemhost"
TOTEM_PORT="8080"

default_db="$(pwd)/db"
db="${3:-$default_db}"
hostuser="$(whoami)"

case "$1_$2." in

#
# Initialize
#

totem_init.)
	bash doc.sh os install
	bash doc.sh mysql install
	bash doc.sh neo4j install
	bash doc.sh totem install

	bash os start
	bash mysql start
	bash neo4j start
	bash totem start
	;;
	
debe_init.)
	bash doc.sh os install
	bash doc.sh mysql install
	bash doc.sh neo4j install
	bash doc.sh debe install

	bash os start
	bash mysql start
	bash neo4j start
	bash debe start
	;;
	
#
# totem functions
#

totem_build.)
	docker build --tag acmesds/totem:latest .

	# publish the image
	# docker push acmesds/totem:latest
	;;

totem_install.)
	# get the image
	docker pull acmesds/neo4j:latest
	if [ "$3" != "" ]; then
		bash doc.sh neo4j adduser $3 $4
		bash doc.sh mysql adduser $3 $4
	fi
	;;

totem_start.)
	echo "starting totem on $db"
	docker run \
		--detach \
		--name=$TOTEM_DOCK \
		-h dockerhost \
		--volume=$db:/local/service/totem/config \
		--env="MYSQL_HOST=mysqlhost" \
		--env="MYSQL_USER=$MYSQL_USER" \
		--env="MYSQL_PASS=$MYSQL_PASS" \
		--env="NEO4J_HOST=bolt://localhost" \
		--env="NEO4J_USER=$NEO4J_USER" \
		--env="NEO4J_PASS=$NEO4J_PASS" \
		--publish 8080:8080 \
		--network totem-net \
		acmesds/totem:latest "node totem/totem.js T3"
	;;
	
totem_debug.)
	echo "debugging totem on $db"
	docker run \
		-it \
		--name=$TOTEM_DOCK \
		-h dockerhost \
		--volume=$db:/local/service/totem/config \
		--volume=/local:/host/local \
		--volume=/mnt/installs:/host/installs \
		--volume=/usr:/host/usr \
		--volume=/lib64:/host/lib64 \
		--env="MYSQL_HOST=mysqlhost" \
		--env="MYSQL_USER=$MYSQL_USER" \
		--env="MYSQL_PASS=$MYSQL_PASS" \
		--env="NEO4J_HOST=bolt://localhost" \
		--env="NEO4J_USER=$NEO4J_USER" \
		--env="NEO4J_PASS=$NEO4J_PASS" \
		--publish 8080:8080 \
		--network totem-net \
		acmesds/totem:latest sh
	;;
	
totem_admin.)
	docker exec -it $TOTEM_DOCK node
	;;
	
totem_test.)
	docker exec -it $TOTEM_DOCK sh
	;;

totem_reset.)
	docker system prune
	# establish network for containers
	docker network create --driver bridge totem-net
	docker network inspect totem-net
	bash doc.sh neo4j start $db/neo4j
	bash doc.sh mysql start $db/mysql
	bash doc.sh totem start $db/totem
	;;

totem_update.)
	docker exec -it $TOTEM_DOCK "bash ./maint.sh resync origin"
	docker commit $TOTEM_DOCK acmesds/totem
	;;
	
totem_publish.)
	docker push acmesds/totem
	;;

#
# dev functions
#

dev_build.)
	docker build --tag acmesds/dev:lastest .
	# publish the image
	# docker push acmesds/dev:latest
	;;

dev_install.)
	echo "Installing dev for vnc user $hostuser"

	#docker pull acmesds/dev:latest
	;;
	
dev_prime.)
	cp /local/prime/vnc_config /etc/systemd/system/vncserver@\:1.service
	;;
	
dev_start.)
	echo -e \
	"[Unit]\n" \
	"Description=Remote desktop service (VNC)\n" \
	"After=syslog.target network.target\n" \
	"[Service]\n" \
	"Type=forking\n" \
	"ExecStartPre=/bin/sh -c '/usr/bin/vncserver -kill %i > /dev/null 2>&1 || :'\n" \
	"ExecStart=/sbin/runuser -l $hostuser -c '/usr/bin/vncserver %i -geometry 1280x1024' \n" \
	"PIDFile=/home/$hostuser/.vnc/%H%i.pid\n" \
	"ExecStop=/bin/sh -c '/usr/bin/vncserver -kill %i > /dev/null 2>&1 || :' \n" \
	"[Install]\n" \
	"WantedBy=multi-user.target\n" \
	> prime/vnc_config

	docker run \
		--detach \
		-it \
		--volume="$(pwd)/prime:/local/prime" \
		acmesds/dev:latest "bash doc.sh dev prime"
	
	;;
	
#
# debe functions
#

debe_build.)
	docker build --tag acmesds/debe:latest .

	# publish the image
	# docker push acmesds/debe:latest
	;;
	
debe_install.)
	# get the image
	docker pull acmesds/debe:latest
	;;
	
debe_start.)
	echo "starting debe on $db"
	docker run \
		--detach \
		--name=$TOTEM_DOCK \
		-h dockerhost \
		--volume=$db:/local/service/debe/config \
		--env="MYSQL_HOST=mysqlhost" \
		--env="MYSQL_USER=$MYSQL_USER" \
		--env="MYSQL_PASS=$MYSQL_PASS" \
		--env="NEO4J_HOST=bolt://localhost" \
		--env="NEO4J_USER=$NEO4J_USER" \
		--env="NEO4J_PASS=$NEO4J_PASS" \
		--publish 8080:8080 \
		--network totem-net \
		acmesds/debe:latest "bash maint.sh D3"
	;;
	
debe_debug.)
	echo "debugging debe on $db"
	docker run \
		-it \
		--name=$TOTEM_DOCK \
		-h dockerhost \
		--volume=$db:/local/service/totem/config \
		--volume=/local:/host/local \
		--volume=/mnt/installs:/host/installs \
		--volume=/usr:/host/usr \
		--volume=/lib64:/host/lib64 \
		--env="MYSQL_HOST=mysqlhost" \
		--env="MYSQL_USER=$MYSQL_USER" \
		--env="MYSQL_PASS=$MYSQL_PASS" \
		--env="NEO4J_HOST=bolt://localhost" \
		--env="NEO4J_USER=$NEO4J_USER" \
		--env="NEO4J_PASS=$NEO4J_PASS" \
		--publish 8080:8080 \
		--publish 8083:8083 \
		--network totem-net \
		acmesds/debe:latest sh
	;;
	
debe_admin.)
	docker exec -it $TOTEM_DOCK node
	;;

debe_test.)
	docker exec -it $TOTEM_DOCK sh
	;;

debe_update.)
	docker exec -it $TOTEM_DOCK "bash ./maint.sh resync origin"
	docker commit $TOTEM_DOCK acmesds/debe
	;;
	
debe_publish.)
	docker push acmesds/debe
	;;
	
debe_build.)
	source ./doc.sh debe_build_conda
	source ./doc.sh debe_build_caffe
	source ./doc.sh debe_build_cesium
	source ./doc.sh debe_build_opencv
	source ./doc.sh debe_build_R
	;;
	
debe_build_conda.)
	cd /local
	bash installs/Anaconda2-2019.10-Linux-x86_64.sh -g -p /local/anaconda2-2019.10
	ln -s anaconda2-2019.10 anaconda
	#bash installs/Anaconda3-2020.11-Linux-x86_64.sh -b -p /local/anaconda3-2020.11
	#ln -s anaconda3-2020.11 anaconda
	;;

debe_build_caffe.)
	cd /local
	cp -r /host/local/boost boost
	cp -r /host/local/cuda-7.0 cuda-7.0
	cp -r /host/local/hdf5 hdf5
	cp -r /host/local/snappy snappy
	cp -r /host/local/lib lib
	cp -r /host/local/lib64 lib64
	cp -r /host/local/protobuf protobuf
	cp -r /host/local/atlas atlas
	cp -r /host/local/bin bin
	cp -r /host/local/cuDNN cuDNN
	cp -r /host/local/glog glog
	cp -r /host/local/lmdb lmdb
	cp -r /host/local/leveldb leveldb
	cp -r /host/local/gflags gflags
	cp -r /host/local/caffe caffe
	;;

debe_build_cesium.)
	cp -r /host/local/cesium cesium
	;;
	
debe_build_opencv.)
	cp /host/lib64/* /lib64
	;;

debe_build_R.)
	cp -r /host/usr/lib64/R /usr/lib64
	cp -r /host/usr/share/R/ /usr/share/R
	;;

#
# neo4j functions
#

neo4j_build.)
	# build image
	docker build --tag acmesds/neo4j:latest .

	# publish the image
	# docker push acmesds/neo4j:latest
	;;

neo4j_install.)
	# get the image
	docker pull acmesds/neo4j:latest
	if [ "$3" != "" ]; then
		bash doc.sh neo4j adduser $3 $4
	fi
	;;
	
neo4j_start.)
	echo "starting neo4j on $db"
	docker run \
		--detach \
		--name=$NEO4J_DOCK \
		--publish 7474:7474 \
		--publish 7687:7687 \
		--volume=$db/data:/neo4j/data \
		--volume=$db/logs:/neo4j/logs \
		--volume=$db/import:/neo4j/import \
		--volume=$db/plugins:/neo4j/plugins \
		--network totem-net \
		acmesds/neo4j:latest 
	;;

neo4j_inspect.)
	docker exec -it $NEO4J_DOCK sh
	;;

neo4j_admin.)
	docker exec -it $NEO4J_DOCK cypher-shell -u$NEO4J_USER -p$NEO4J_PASS
	;;

neo4j_test.)
	docker exec -it $NEO4J_DOCK sh
	;;

neo4j_kill.)
	docker stop $NEO4J_DOCK
	docker rm $NEO4J_DOCK
	;;

neo4j_adduser.)
	echo -e "CALL dbms.security.createUser('$3', '$4');\n" > prime/setpass.sql
	docker exec -it $NEO4J_DOCK cypher-shell -u $NEO$J_USER -p $NEO4J_PASS < prime/setpass.sql
	;;
	
#
# os functions
#

os_install.)
	docker pull centos:7.8.2003
	;;
	
os_run.)
	docker run \
		--detach \
		--name=$OS_DOCK \
		--network totem-net \
		centos:7.8.2003
	;;
	
os_admin.)
	docker exec -it $OS_DOCK sh
	;;

os_test.)
	docker exec -it $OS_DOCK sh
	;;

#
# all functions
#

all_install.)
	for mod in os neo4j mysql totem debe; do
		bash ./maint.sh $mod install
	done
	;;

all_start.)
	for mod in os neo4j mysql debe; do
		bash ./maint.sh $mod start
	done
	;;

all_stop.)
	for mod in os neo4j mysql debe; do
		bash ./maint.sh $mod stop
	done
	;;

#
# docker functions
#

docker_install.)
	# download and execute install script from the Docker team
	wget -qO- https://get.docker.com/ | sh
	# add your user to the docker group
	sudo usermod -aG docker $(whoami)
	# Set Docker to start automatically at boot time
	sudo systemctl enable docker.service
	
	bash doc.sh docker start
	;;
	
docker_start.)
	sudo systemctl start docker.service	
	docker images
	bash doc.sh docker restart
	;;

docker_redoc.)
	jsdoc2md --template README.hbs --files doc.js >README.md
	git commit -am 'redoc'
	git push agent master
	;;
	
#
# mysql functions
#

mysql_prime.)
	mysqldump -u$MYSQL_USER -p$MYSQL_PASS -h$MYSQL_HOST --no-data openv > prime/openv.sql
	mysqldump -u$MYSQL_USER -p$MYSQL_PASS -h$MYSQL_HOST --no-data -R app --ignore-table=app.gtd > prime/app.sql
	mysqldump -u$MYSQL_USER -p$MYSQL_PASS -h$MYSQL_HOST -ndtR app > prime/funcs.sql
	echo -e "create database openv;create database app;\n" > prime/init.sql
	;;
	
mysql_build.)
	# save the database schema
	if [ "$3" == "prime" ]; then
		bash doc.sh mysql prime
	fi
	
	# build image
	docker build --tag acmesds/mysql:latest .

	# publish the image
	# docker push acmesds/mysql:latest
	;;
	
mysql_install.)
	# get the image
	docker pull acmesds/mysql:latest
	if [ "$3" != "" ]; then
		bash doc.sh mysql adduser $3 $4
	fi	
	;;

mysql_inspect.)
	docker exec -it $MYSQL_DOCK sh
	;;

mysql_admin.)
	docker exec -it $MYSQL_DOCK mysql -u$MYSQL_USER -p$MYSQL_PASS
	;;
	
mysql_test.)
	docker exec -it $MYSQL_DOCK sh
	;;
	
mysql_start.)
	echo "starting mysql on $db"
	docker run \
		--detach \
		--name=$MYSQL_DOCK \
		--publish $MYSQL_PORT:3306 \
		--volume=$db:/local/sqldb \
		--network totem-net \
		acmesds/mysql:latest 
	;;

mysql_kill.)
	docker stop $MYSQL_DOCK
	docker rm $MYSQL_DOCK
	;;

mysql_adduser.)
	#echo "alter user 'root'@'localhost' identified by '$3';\n" > prime/setpass.sql
	echo -e "create user $3 identified by '$4';\n" > prime/adduser.sql
	./bin/mysql -u$MYSQL_USER --skip-password -h$MYSQL_HOST < prime/adduser.sql
	;;

#
# Legacy mysql prime
#

_mysql_dbprime.)
	./bin/mysql -u$MYSQL_USER --skip-password -h$MYSQL_HOST < prime/init.sql
	./bin/mysql -u$MYSQL_USER --skip-password -h$MYSQL_HOST openv < prime/openv.sql	
	./bin/mysql -u$MYSQL_USER --skip-password -h$MYSQL_HOST app < prime/app.sql	
	./bin/mysql -u$MYSQL_USER --skip-password -h$MYSQL_HOST app < prime/funcs.sql
	;;

_mysql_prime.)

	# prime the databases
	docker exec \
		$MYSQL_DOCK \
		bash doc.sh mysql dbprime 

	# prime the databases
	docker exec \
		$MYSQL_DOCK \
		bash doc.sh mysql adduser $3 $4
	;;

*|help.)
	echo -e \
	"Usage:\n\n" \
	"	bash ./doc.sh [docker | totem | debe | mysql | neo4j] [install | start | admin | debug | test]\n\n" \
	"See https://github.com/totemstan/dockify\n"
	;;
	
esac
