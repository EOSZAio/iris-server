FROM ubuntu:18.04

RUN apt update && apt install -y git g++ make cmake libboost-dev libboost-thread-dev libboost-test-dev  libboost-filesystem-dev libboost-date-time-dev libboost-system-dev libboost-iostreams-dev  libboost-program-options-dev libboost-locale-dev libssl-dev libgmp-dev build-essential

RUN git clone -b v1.2 --single-branch https://github.com/EOSChronicleProject/eos-chronicle.git

RUN cd eos-chronicle \
&& git submodule update --init --recursive \
&& mkdir build \
&& cd build \
&& cmake .. \
&& make

#COPY config.dev.ini /config.ini
COPY config.ini /config.ini
#Run chronicle as follows in order to create a docker container with PID 1 running chronicle in order to be ablt 
#to stop the container "docker stop" and chronicle will shutdown cleanly.
CMD ["/eos-chronicle/build/chronicle-receiver", "--config-dir=/","--data-dir=/chronicle-data"]