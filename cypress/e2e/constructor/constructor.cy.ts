import { TIngredient, TOrder } from '../../../src/utils/types';

let mockBun: TIngredient;
let mockIngrs: TIngredient[] = [];
let successOrder: {
  name: string,
  success: boolean,
  order: TOrder
};

beforeEach(() => {
  const accessToken = 'fake-access-token';
  const refreshToken = 'fake-refresh-token';
  cy.setCookie('accessToken', accessToken);
  window.localStorage.setItem('refreshToken', refreshToken);
  cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
  cy.intercept('GET', 'api/orders/all', { fixture: 'all-orders.json' });
  cy.intercept('GET', 'api/auth/user', {
    fixture: 'user.json',
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  });
  cy.intercept('GET', 'api/orders', {
    fixture: 'orders.json',
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  });
  cy.intercept('POST', 'api/orders', (req) => {
    expect(req.headers.authorization).to.eq(accessToken);
    expect(req.body).to.deep.eq({
      ingredients: [mockBun._id, mockIngrs[0]._id, mockIngrs[1]._id, mockBun._id]
    });
    req.reply({
      statusCode: 200,
      fixture: 'order-success.json'
    });
  });
  cy.visit('http://localhost:4000'); 
})

before(() => {
  cy.fixture('ingredients.json').then((ingredients) => {
    mockBun = ingredients.data[0];
    mockIngrs.push(ingredients.data[1]);
    mockIngrs.push(ingredients.data[2]);
  });
  cy.fixture('order-success.json').then((order) => {
    successOrder = order;
  });
});

describe('Проверка модального окна ингредиента', () => {

  it('[#1] Модальное окно должно открываться', () => {
    const ingredient = cy.get(`[data-cy="ingredient-item-${mockBun._id}"]`);
    ingredient.click();
    const modal = cy.get('[data-cy="modal"]');
    modal.should('be.visible');
  });

  it('[#2] Модальное окно должно содержать верные данные', () => {
    const ingredient = cy.get('[data-cy="ingredient-item-643d69a5c3f7b9001cfa093c"]');
    ingredient.click();
    cy.get('[data-cy="modal"]').within(() => {
      cy.get('h3').contains(mockBun.name);
        
        cy.contains('li', 'Калории, ккал')
          .within(() => {
            cy.get('p').eq(1).should('have.text', mockBun.calories);
          });

        cy.contains('li', 'Белки, г')
          .within(() => {
            cy.get('p').eq(1).should('have.text', mockBun.proteins);
          });
        
        cy.contains('li', 'Жиры, г')
          .within(() => {
            cy.get('p').eq(1).should('have.text', mockBun.fat);
          });
        
        cy.contains('li', 'Углеводы, г')
          .within(() => {
            cy.get('p').eq(1).should('have.text', mockBun.carbohydrates);
          });

        cy.get('img')
          .should('have.attr', 'src', mockBun.image_large);
    });
  });

    it('[#3] Модальное окно должно закрываться на крестик', () => {
      const ingredient = cy.get('[data-cy="ingredient-item-643d69a5c3f7b9001cfa093c"]');
      ingredient.click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="modal"]').find('button').click();;   
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('[#4] Модальное окно должно закрываться по клику на оверлей', () => {
      const ingredient = cy.get('[data-cy="ingredient-item-643d69a5c3f7b9001cfa093c"]');
      ingredient.click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('body').click(0, 0);
      cy.get('[data-cy="modal"]').should('not.exist');
    });
});

describe('Добавление ингредиентов в конструктор', () => {
  it('[#1] Добавление булки', () => {
    cy.get(`[data-cy="ingredient-item-${mockBun._id}"]`)
      .find('button')
      .click();
    
    cy.get('[data-cy="constructor-top"]').within(() => {
      cy.get('img')
        .should('have.attr', 'src', mockBun.image);
      cy.contains('span', mockBun.name);
      cy.contains('span', mockBun.price);
    });

    cy.get('[data-cy="constructor-bottom"]').within(() => {
      cy.get('img')
        .should('have.attr', 'src', mockBun.image);
      cy.contains('span', mockBun.name);
      cy.contains('span', mockBun.price);
    });
  });

  it('[#2] Добавление ингредиентов', () => {
    cy.get(`[data-cy="ingredient-item-${mockBun._id}"]`)
      .find('button')
      .click();
    cy.get(`[data-cy="ingredient-item-${mockIngrs[0]._id}"]`)
      .find('button')
      .click();
    cy.get(`[data-cy="ingredient-item-${mockIngrs[1]._id}"]`)
      .find('button')
      .click();
    cy.get('[data-cy="constructor-element"]')
    .should('have.length', 2)
    .each(($el, index) => {
      cy.wrap($el).within(() => {
        cy.get('img')
          .should('have.attr', 'src', mockIngrs[index].image);
        cy.contains('span', mockIngrs[index].name);
        cy.contains('span', mockIngrs[index].price);
      });
    });
  });

  it('[#3] Оформление заказа', () => {
    // Добавление ингредиентов
    cy.get(`[data-cy="ingredient-item-${mockBun._id}"]`)
      .find('button')
      .click();
    cy.get(`[data-cy="ingredient-item-${mockIngrs[0]._id}"]`)
      .find('button')
      .click();
    cy.get(`[data-cy="ingredient-item-${mockIngrs[1]._id}"]`)
      .find('button')
      .click();
    cy.get('[data-cy="constructor-element"]')
    .should('have.length', 2)
    .each(($el, index) => {
      cy.wrap($el).within(() => {
        cy.get('img')
          .should('have.attr', 'src', mockIngrs[index].image);
        cy.contains('span', mockIngrs[index].name);
        cy.contains('span', mockIngrs[index].price);
      });
    });
    // Оформление заказа
    cy.get('[data-cy="order-button"]').click();
    cy.get('[data-cy="modal"]').within(() => {
      cy.contains('h2', successOrder.order.number);
      cy.contains('p', 'Ваш заказ начали готовить');
    });
    // Закрытие модального окна
    cy.get('body').click(0, 0);
    cy.get('[data-cy="modal"]').should('not.exist');
    // Проверка пустоты конструктора
    cy.get('[data-cy="constructor-top"]').should('have.length', 0);
    cy.get('[data-cy="constructor-bottom"]').should('have.length', 0);
    cy.get('[data-cy="constructor-element"]').should('have.length', 0)
  });
});