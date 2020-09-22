FROM node:10-slim AS consultoriovirtual-builder


# Args
ARG BASEDIR=/opt
ARG EDUMEET=cv-local
ARG NODE_ENV=production
ARG SERVER_DEBUG=''
ARG BRANCH=master
ARG REACT_APP_DEBUG=''

WORKDIR ${BASEDIR}

RUN apt-get update;apt-get install -y git bash

# RUN eval $(ssh-agent) && \
#     ssh-add $(cat /Downloads/github_key) && \
#     ssh-keyscan -H github.com >> /etc/ssh/ssh_known_hosts
ARG SSH_KEY
ENV SSH_KEY=$SSH_KEY

# Make ssh dir
RUN mkdir /root/.ssh/
 
# Create id_rsa from string arg, and set permissions

RUN echo "$SSH_KEY" > /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa
 
# Create known_hosts
RUN touch /root/.ssh/known_hosts

# Add git providers to known_hosts
RUN ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts
RUN ssh-keyscan gitlab.com >> /root/.ssh/known_hosts

#checkout code
#RUN git clone --single-branch --branch ${BRANCH} https://github.com/AugustoZanoni/${EDUMEET}.git
RUN git clone git@github.com:AugustoZanoni/${EDUMEET}.git


#checkout code
#RUN git clone --single-branch --branch ${BRANCH} https://github.com/AugustoZanoni/${EDUMEET}.git

#install app dep
WORKDIR ${BASEDIR}/${EDUMEET}/app

RUN npm install

# set app in producion mode/minified/.
ENV NODE_ENV ${NODE_ENV}

# Workaround for the next npm run build => rm -rf public dir even if it does not exists.
# TODO: Fix it smarter
RUN mkdir -p ${BASEDIR}/${EDUMEET}/server/public

ENV REACT_APP_DEBUG=${REACT_APP_DEBUG}

# package web app
RUN npm run build

#install server dep
WORKDIR ${BASEDIR}/${EDUMEET}/server

RUN apt-get install -y git build-essential python

RUN npm install
RUN npm install logstash-client

FROM node:10-slim

# Args
ARG BASEDIR=/opt
ARG EDUMEET=cv-local
ARG NODE_ENV=production
ARG SERVER_DEBUG=''

WORKDIR ${BASEDIR}


COPY --from=consultoriovirtual-builder ${BASEDIR}/${EDUMEET}/server ${BASEDIR}/${EDUMEET}/server



# Web PORTS
EXPOSE 80 443 
EXPOSE 40000-49999/udp


## run server 
ENV DEBUG ${SERVER_DEBUG}

COPY docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
