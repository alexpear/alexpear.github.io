module.exports = `

Generic:
  - name: TODO

GenericHistorical:
  - name: TODO

GenericModern:
  - name: TODO

GenericScifi:
  - name: TODO

Twig:
  - name: Sylvester
    tags: character human male child criminal biotech
    ruleTags: unique
    cost: 100
    attack:
      name: Throwing Knife
      range: 10
      damage: 2
    focus: 5
    knowledge: 3
    observation: 4
    social: 5
    stealth: 3
    resistance:
      poison: 1
    text: 'Romantic towards: Female'

  - name: Lillian
    tags: character human female child scientist biotech
    ruleTags: unique
    cost: 20
    durability: -1
    focus: 1
    knowledge: 4
    observation: 1
    social: 1
    stealth: 1
    text: 'Romantic towards: Female, Male'
    # Her exosuit is a separate card.

`;