beforeEach( () => {

  cy.intercept('GET', 'api/ingredients/', { fixture:'ingredients.json'});
  cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
  cy.intercept('GET', 'api/orders/all', { fixture: 'feed.json' }).as('feed');
  cy.setCookie('accessToken', 'mockTokenForEvgeniya');
  localStorage.setItem('refreshToken', 'mockTokenForEvgeniya');
  cy.visit('/');
  
})

describe('Тест работы конструктора', ()=>{
  it('проверка наличия ингредиента в конструкторе - булки', () => {
    //находим div с конструктором, проверяем, что в нем нет флуоресцентной булки
    cy.get(`[data-cy='constructor-module']`)
      .should('not.contain.text', 'Флюоресцентная булка R2-D3')
  });

  it('добавление ингредиента в конструктор - булки', () => {
    //находим div с ингредиентами, доходим до кнопки "добавить" в ингредиенте флуоресцентной булки, нажимаем
    cy.get(`[data-cy='ingredients-module']`)
      .first()
        .children()
          .last()
            .find('button')
              .click();
    //проверяем, что в конструкторе появилась флуоресцентная булка
    cy.get(`[data-cy='constructor-module']`)    
              .should('contain.text', 'Флюоресцентная булка R2-D3');
  });

  it('добавление ингредиента в конструктор - другой ингредиент', ()=>{
    //находим div с ингредиентами, доходим до кнопки "добавить" в ингредиенте с биокотлетой, нажимаем
    cy.get(`[data-cy='ingredients-module']`)
      .next()
        .next()
          .children()
            .first()
              .find('button')
                .click();
    //проверяем, что в конструкторе появилась биокотлета
    cy.get(`[data-cy='constructor-module']`)    
      .should('contain.text', 'Биокотлета из марсианской Магнолии');
  });
});

describe('Тест работы модальных окон', () => {
          
  it('тест открытия модального окна', () => {
    //находим ссылку с кратерной булкой, нажимаем
    cy.contains('Краторная булка N-200i')
      .click();
    //находим модальное окно, проверяем, что модальное окно видимо 
    cy.get(`[data-cy='modal']`)
      .should('be.visible')
  });

  it('тест закрытия модального окна по крестику', () => {
    cy.contains('Краторная булка N-200i')
      .click();
    //находим кнопку в модалке, нажимаем
    cy.get(`[data-cy='modal']`)
      .find('button')
        .click();
    //проверяем, что модальное окно закрыто
    cy.get(`[data-cy='modal']`)
      .should('not.exist')
  });
  
  it('тест закрытия модального окна по esc', () => {
    //находим ссылку с кратерной булкой, нажимаем
    cy.contains('Краторная булка N-200i')
      .click();
    //нажимаем на кнопку эскейп
    cy.get('body')
      .type('{esc}')
    //проверяем, что модальное окно закрыто
    cy.get(`[data-cy='modal']`)
      .should('not.exist')
  })

  it('тест закрытия модального окна по оверлею', () => {
    //находим ссылку с кратерной булкой, нажимаем
    cy.contains('Краторная булка N-200i')
      .click();
    //нажимаем на поле вверху экрана (выше модалки)
    cy.get(`[data-cy='modalOverlay']`)
      .click('top', {force: true})
    //проверяем, что модальное окно закрыто
    cy.get(`[data-cy='modal']`)
      .should('not.exist')
  })
})

describe('Тест оформления заказа', () => {
  // перехватываем апи размещения заказа и проверяем авторизацию
  beforeEach(() => {
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('order');

    it('Проверка авторизации пользователя перед каждым тестом', function () {
      cy.get('p').contains('12345').should('exist');
    });
  });

  // добавляем в заказ флуоресцентную булку
  it('добавляем ингредиенты в заказ', () => {
    // добавляем в заказ флуоресцентную булку
    cy.get(`[data-cy='ingredients-module']`)
      .first()
        .children()
          .last()
            .find('button')
              .click();
    // добавляем в заказ биокотлету
    cy.get(`[data-cy='ingredients-module']`)
      .next()
        .next()
          .children()
            .first()
              .find('button')
                .click();
    // добавляем в заказ соус антарианского плоскоходца
    cy.get(`[data-cy='ingredients-module']`)
      .last()
        .children()
          .last()
            .find('button')
              .click()
    //нажимаем на кнопку заказа
    cy.get(`[data-cy='constructor-module']`)
      .children()
        .last()
          .find('button')
            .click()
    
    cy.wait('@order')

    //проверяем, что модальное окно открылось
    cy.get(`[data-cy='modal']`)
      .should('be.visible')

    //нажимаем на кнопку закрытия
    cy.get(`[data-cy='modal']`)
      .find('button')
        .click();

    //проверяем, что конструктор пустой - 
    cy.get(`[data-cy='constructor-module']`)
      .children()
        .first()
          .should('contain.text', 'Выберите булки')

    cy.get(`[data-cy='constructor-module']`)
      .children()
        .first()
          .next()
            .should('contain.text', 'Выберите начинку')


    })

    
    
  
})
