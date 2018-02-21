FROM node

MAINTAINER CHM SQRT2 Team <contact@chm-sqrt2.com>

# Setup users and groups.

RUN groupadd truesparrow && \
    useradd -ms /bin/bash -g truesparrow truesparrow

# Setup directory structure.

RUN mkdir /truesparrow
COPY . /truesparrow
RUN chown -R truesparrow:truesparrow /truesparrow/out

# Setup the runtime environment for the application.

ENV ENV LOCAL
ENV CONTEXT SERVER
ENV ADDRESS 0.0.0.0
ENV PORT 10000
ENV ORIGIN http://localhost:10004
ENV ORIGIN_WITH_SUBDOMAIN http://{0}.localhost:10004
ENV IDENTITY_SERVICE_HOST truesparrow-identity:10000
ENV CONTENT_SERVICE_HOST truesparrow-content:10000

WORKDIR /truesparrow
EXPOSE 10000
USER truesparrow
ENTRYPOINT ["npm", "run", "serve-dev"]
