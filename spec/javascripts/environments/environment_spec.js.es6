const Vue = require('vue');
require('~/flash');
const EnvironmentsComponent = require('~/environments/components/environment');
const { environment } = require('./mock_data');

describe('Environment', () => {
  preloadFixtures('static/environments/environments.html.raw');

  let component;

  beforeEach(() => {
    loadFixtures('static/environments/environments.html.raw');
  });

  describe('successfull request', () => {
    describe('without environments', () => {
      const environmentsEmptyResponseInterceptor = (request, next) => {
        next(request.respondWith(JSON.stringify([]), {
          status: 200,
        }));
      };

      beforeEach(() => {
        Vue.http.interceptors.push(environmentsEmptyResponseInterceptor);
      });

      afterEach(() => {
        Vue.http.interceptors = _.without(
          Vue.http.interceptors, environmentsEmptyResponseInterceptor,
        );
      });

      it('should render the empty state', (done) => {
        component = new EnvironmentsComponent({
          el: document.querySelector('#environments-list-view'),
        });

        setTimeout(() => {
          expect(
            component.$el.querySelector('.js-new-environment-button').textContent,
          ).toContain('New Environment');

          expect(
            component.$el.querySelector('.js-blank-state-title').textContent,
          ).toContain('You don\'t have any environments right now.');

          done();
        }, 0);
      });
    });

    describe('with environments', () => {
      const environmentsResponseInterceptor = (request, next) => {
        next(request.respondWith(JSON.stringify({
          environments: [environment],
          stopped_count: 1,
          available_count: 0,
        }), {
          status: 200,
        }));
      };

      beforeEach(() => {
        Vue.http.interceptors.push(environmentsResponseInterceptor);
      });

      afterEach(() => {
        Vue.http.interceptors = _.without(
          Vue.http.interceptors, environmentsResponseInterceptor,
        );
      });

      it('should render a table with environments', (done) => {
        component = new EnvironmentsComponent({
          el: document.querySelector('#environments-list-view'),
        });

        setTimeout(() => {
          expect(
            component.$el.querySelectorAll('table tbody tr').length,
          ).toEqual(1);
          done();
        }, 0);
      });
    });
  });

  describe('unsuccessfull request', () => {
    const environmentsErrorResponseInterceptor = (request, next) => {
      next(request.respondWith(JSON.stringify([]), {
        status: 500,
      }));
    };

    beforeEach(() => {
      Vue.http.interceptors.push(environmentsErrorResponseInterceptor);
    });

    afterEach(() => {
      Vue.http.interceptors = _.without(
        Vue.http.interceptors, environmentsErrorResponseInterceptor,
      );
    });

    it('should render empty state', (done) => {
      component = new EnvironmentsComponent({
        el: document.querySelector('#environments-list-view'),
      });

      setTimeout(() => {
        expect(
          component.$el.querySelector('.js-blank-state-title').textContent,
        ).toContain('You don\'t have any environments right now.');
        done();
      }, 0);
    });
  });
});
