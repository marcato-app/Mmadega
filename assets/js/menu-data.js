/* Cardápio Adega MM — dados extraídos do cardápio oficial (PDF).
   Sem backend: o site inteiro é estático, então o cardápio mora aqui. */
window.MENU_DATA = {
  sections: [
    {
      id: 'cervejas',
      title: 'Cervejas',
      groups: [
        {
          title: 'Long Neck',
          keywords: 'cerveja long neck garrafinha',
          items: [
            { name: 'Heineken 330ml', price: 'R$ 8,00' },
            { name: 'Heineken Zero 330ml', price: 'R$ 8,00' },
            { name: 'Budweiser 330ml', price: 'R$ 8,00' },
            { name: 'Corona 330ml', price: 'R$ 10,00' },
            { name: 'Corona Zero 330ml', price: 'R$ 10,00' },
            { name: 'Stella Artois 330ml', price: 'R$ 8,00' },
            { name: 'Stella Pure Gold 330ml', price: 'R$ 8,00' },
            { name: 'Spaten 355ml', price: 'R$ 8,00' },
            { name: 'Becks 330ml', price: 'R$ 8,00' }
          ]
        },
        {
          title: 'Latas',
          keywords: 'cerveja lata',
          items: [
            { name: 'Amstel 269ml', price: 'R$ 3,50' },
            { name: 'Budweiser 269ml', price: 'R$ 4,50' },
            { name: 'Duplo Malte 350ml', price: 'R$ 5,00' },
            { name: 'Duplo Malte 269ml', price: 'R$ 4,00' },
            { name: 'Heineken 269ml', price: 'R$ 5,00' },
            { name: 'Heineken 350ml', price: 'R$ 6,00' },
            { name: 'Heineken Zero 269ml', price: 'R$ 5,00' },
            { name: 'Império 269ml', price: 'R$ 3,50' },
            { name: 'Itaipava 269ml', price: 'R$ 3,00' },
            { name: 'Original 269ml', price: 'R$ 4,50' },
            { name: 'Petra 269ml', price: 'R$ 3,50' },
            { name: 'Skol 269ml', price: 'R$ 3,50' },
            { name: 'Spaten 269ml', price: 'R$ 4,50' },
            { name: 'Mascate Maracujá 362ml', price: 'R$ 12,00' },
            { name: 'Mascate Melancia 362ml', price: 'R$ 12,00' },
            { name: 'Xeque Mate 355ml', price: 'R$ 10,00' }
          ]
        },
        {
          title: 'Caixa de Cerveja',
          keywords: 'cerveja caixa fardo fechado',
          items: [
            { name: 'Skol 269ml', unit: '15 und', price: 'R$ 42,00' },
            { name: 'Itaipava 269ml', unit: '12 und', price: 'R$ 32,00' },
            { name: 'Amstel 269ml', unit: '12 und', price: 'R$ 38,00' },
            { name: 'Petra 269ml', unit: '12 und', price: 'R$ 34,00' },
            { name: 'Império 269ml', unit: '15 und', price: 'R$ 42,00' },
            { name: 'Brahma Duplo Malte 350ml', unit: '12 und', price: 'R$ 48,00' },
            { name: 'Budweiser 269ml', unit: '8 und', price: 'R$ 32,00' },
            { name: 'Original 269ml', unit: '8 und', price: 'R$ 32,00' },
            { name: 'Original 269ml', unit: '15 und', price: 'R$ 52,00' },
            { name: 'Heineken 350ml', unit: '12 und', price: 'R$ 65,00' },
            { name: 'Heineken Zero 269ml', unit: '8 und', price: 'R$ 40,00' },
            { name: 'Heineken 269ml', unit: '8 und', price: 'R$ 38,00' },
            { name: 'Spaten 269ml', unit: '8 und', price: 'R$ 32,00' },
            { name: 'Mascate Maracujá 362ml', unit: '8 und', price: 'R$ 80,00' },
            { name: 'Mascate Melancia 362ml', unit: '8 und', price: 'R$ 80,00' },
            { name: 'Xeque Mate 355ml', unit: '12 und', price: 'R$ 90,00' }
          ]
        }
      ]
    },
    {
      id: 'doses',
      title: 'Doses',
      groups: [
        {
          title: 'Copo 700ml',
          note: 'Vem com gelo. Peça sua combinação preferida.',
          keywords: 'dose copo whisky vodka gin redbull',
          items: [
            { name: "Askov + Vibe + Gelo", price: 'R$ 12,00' },
            { name: "Askov + Baly + Gelo", price: 'R$ 10,00' },
            { name: "Smirnoff + Vibe + Gelo", price: 'R$ 15,00' },
            { name: "Smirnoff + Redbull + Gelo", price: 'R$ 23,00' },
            { name: "Absolut + Redbull + Gelo", price: 'R$ 30,00' },
            { name: "Ciroc Red Berry + Redbull + Gelo", price: 'R$ 60,00' },
            { name: "Gin Rock's + Baly + Gelo", price: 'R$ 15,00' },
            { name: "Gin Rock's + Redbull + Gelo", price: 'R$ 25,00' },
            { name: "Eternity + Baly + Gelo", price: 'R$ 12,00' },
            { name: "Eternity + Redbull + Gelo", price: 'R$ 22,00' },
            { name: "Tanqueray + Redbull + Gelo", price: 'R$ 40,00' },
            { name: "Tanqueray Bossa Nova + Redbull + Gelo", price: 'R$ 55,00' },
            { name: "Tanqueray Royale + Redbull + Gelo", price: 'R$ 55,00' },
            { name: "Gordon's + Redbull + Gelo", price: 'R$ 30,00' },
            { name: "Beefeater + Redbull + Gelo", price: 'R$ 40,00' },
            { name: "Beefeater Pink + Redbull + Gelo", price: 'R$ 45,00' },
            { name: "Bombay + Redbull + Gelo", price: 'R$ 40,00' },
            { name: "Malibu + Redbull + Gelo", price: 'R$ 30,00' },
            { name: "Malibu + Baly + Gelo", price: 'R$ 20,00' },
            { name: "Bombeirinho", price: 'R$ 15,00' },
            { name: "Cavalo Branco + Vibe + Gelo", price: 'R$ 20,00' },
            { name: "Cavalo Branco + Redbull + Gelo", price: 'R$ 30,00' },
            { name: "Passport + Vibe + Gelo", price: 'R$ 15,00' },
            { name: "Passport + Redbull + Gelo", price: 'R$ 23,00' },
            { name: "Jack Daniel's Tradicional + Redbull + Gelo", price: 'R$ 40,00' },
            { name: "Jack Daniel's Maçã + Redbull + Gelo", price: 'R$ 55,00' },
            { name: "Jack Daniel's Canela + Redbull + Gelo", price: 'R$ 50,00' },
            { name: "Jack Daniel's Mel + Redbull + Gelo", price: 'R$ 50,00' },
            { name: "Jack Gentleman + Redbull + Gelo", price: 'R$ 55,00' },
            { name: "Jim Beam + Redbull + Gelo", price: 'R$ 30,00' },
            { name: "Gold Label + Redbull + Gelo", price: 'R$ 70,00' },
            { name: "Buchanan's + Redbull + Gelo", price: 'R$ 50,00' },
            { name: "Ballantine's + Vibe + Gelo", price: 'R$ 22,00' },
            { name: "Ballantine's + Redbull + Gelo", price: 'R$ 30,00' },
            { name: "Chivas + Redbull + Gelo", price: 'R$ 50,00' },
            { name: "Old Parr + Redbull + Gelo", price: 'R$ 40,00' },
            { name: "Red Label + Redbull + Gelo", price: 'R$ 40,00' },
            { name: "Black Label + Redbull + Gelo", price: 'R$ 55,00' },
            { name: "Chanceller + Vibe + Gelo", price: 'R$ 10,00' },
            { name: "Licor Goly + Redbull + Gelo", price: 'R$ 40,00' }
          ]
        }
      ]
    },
    {
      id: 'garrafas',
      title: 'Garrafas',
      groups: [
        {
          title: 'Whisky',
          keywords: 'garrafa whisky whiskey jack daniels chivas',
          items: [
            { name: 'Passport', price: 'R$ 58,00' },
            { name: 'Cavalo Branco', unit: '1L', price: 'R$ 80,00' },
            { name: 'Red Label', price: 'R$ 95,00' },
            { name: 'Ballantine’s 8 anos', price: 'R$ 85,00' },
            { name: 'Ballantine’s Caramelo', price: 'R$ 95,00' },
            { name: 'Black Label', price: 'R$ 195,00' },
            { name: 'Double Black', price: 'R$ 215,00' },
            { name: 'Gold Label', price: 'R$ 300,00' },
            { name: 'Green Label', price: 'R$ 450,00' },
            { name: 'Old Parr', price: 'R$ 165,00' },
            { name: 'Jack Daniel’s Tradicional', unit: '200ml', price: 'R$ 50,00' },
            { name: 'Jack Daniel’s Tradicional', unit: '375ml', price: 'R$ 70,00' },
            { name: 'Jack Daniel’s Tradicional', price: 'R$ 175,00' },
            { name: 'Jack Daniel’s Mel', price: 'R$ 175,00' },
            { name: 'Jack Daniel’s Fire', price: 'R$ 175,00' },
            { name: 'Jack Daniel’s Maçã', price: 'R$ 190,00' },
            { name: 'Jack Daniel’s Maçã', unit: '700ml', price: 'R$ 145,00' },
            { name: 'Jack Gentleman', price: 'R$ 185,00' },
            { name: 'Jack Barrel', price: 'R$ 265,00' },
            { name: 'Jack Black Barry', price: 'R$ 220,00' },
            { name: 'Jack Daniel’s Mclaren', price: 'R$ 140,00' },
            { name: 'Jim Beam', price: 'R$ 95,00' },
            { name: 'Chivas 12 anos', price: 'R$ 145,00' },
            { name: 'Chivas 18 anos', price: 'R$ 350,00' },
            { name: 'Chanceller', price: 'R$ 25,00' },
            { name: 'Buchanan’s Deluxe', price: 'R$ 180,00' },
            { name: 'Woodford Reserve', price: 'R$ 195,00' },
            { name: 'Blue Label', price: 'R$ 1.300,00' },
            { name: 'Johnnie Walker Sinatra', price: 'R$ 830,00' },
            { name: 'Royal Salute', price: 'R$ 830,00' }
          ]
        },
        {
          title: 'Gin',
          keywords: 'garrafa gin tanqueray gordons beefeater',
          items: [
            { name: 'Tanqueray', price: 'R$ 125,00' },
            { name: 'Tanqueray Sevilla', price: 'R$ 155,00' },
            { name: 'Tanqueray Royale', price: 'R$ 165,00' },
            { name: 'Tanqueray Bossa Nova', price: 'R$ 165,00' },
            { name: 'Bombay', price: 'R$ 100,00' },
            { name: 'Beefeater Pink', price: 'R$ 135,00' },
            { name: 'Beefeater Limão', price: 'R$ 120,00' },
            { name: 'Beefeater Tradicional', price: 'R$ 120,00' },
            { name: 'Beefeater Blackberry', price: 'R$ 130,00' },
            { name: 'Intenção / Eternity Royale', price: 'R$ 30,00' },
            { name: 'Gordon’s Pink', price: 'R$ 95,00' },
            { name: 'Gordon’s Tradicional', price: 'R$ 85,00' },
            { name: 'Gin Rock’s', price: 'R$ 40,00' }
          ]
        },
        {
          title: 'Vodka',
          keywords: 'garrafa vodka absolut smirnoff',
          items: [
            { name: 'Askov Tradicional', price: 'R$ 25,00' },
            { name: 'Askov Sabor', price: 'R$ 22,00' },
            { name: 'Ciroc Red Berry', price: 'R$ 220,00' },
            { name: 'Absolut', price: 'R$ 85,00' },
            { name: 'Absolut de Sabor', price: 'R$ 85,00' },
            { name: 'Smirnoff', price: 'R$ 40,00' },
            { name: 'Grey Goose', price: 'R$ 150,00' },
            { name: 'Grey Goose Saborizado', price: 'R$ 160,00' },
            { name: 'Belvedere', price: 'R$ 150,00' }
          ]
        },
        {
          title: 'Rum e outros',
          keywords: 'garrafa rum malibu sake',
          items: [
            { name: 'Malibu', price: 'R$ 70,00' },
            { name: 'Combo Malibu + 5 Baly + Gelos', price: 'R$ 105,00' },
            { name: 'Saquê', price: 'R$ 25,00' }
          ]
        }
      ]
    },
    {
      id: 'combos',
      title: 'Combos',
      groups: [
        {
          title: 'Combos de Whisky',
          note: 'Todos os combos acompanham 5 gelos e copos.',
          keywords: 'combo whisky',
          items: [
            { name: 'Passport + Vibe 2L', price: 'R$ 85,00' },
            { name: 'Cavalo Branco 1L + Vibe 2L', price: 'R$ 105,00' },
            { name: 'Cavalo Branco 1L + 5 Redbull', price: 'R$ 135,00' },
            { name: 'Red Label + 5 Redbull', price: 'R$ 145,00' },
            { name: 'Red Label + Vibe 2L', price: 'R$ 115,00' },
            { name: 'Ballantine’s 8 anos + 5 Redbull', price: 'R$ 140,00' },
            { name: 'Ballantine’s 8 anos + Vibe 2L', price: 'R$ 110,00' },
            { name: 'Ballantine’s Caramelo + 5 Redbull', price: 'R$ 160,00' },
            { name: 'Black Label + 5 Redbull', price: 'R$ 260,00' },
            { name: 'Double Black + 5 Redbull', price: 'R$ 280,00' },
            { name: 'Gold Label + 5 Redbull', price: 'R$ 370,00' },
            { name: 'Old Parr + 5 Redbull', price: 'R$ 230,00' },
            { name: 'Jack Daniel’s Tradicional + 5 Redbull', price: 'R$ 230,00' },
            { name: 'Jack Daniel’s Mel ou Fire + 5 Redbull', price: 'R$ 230,00' },
            { name: 'Jack Daniel’s Maçã + 5 Redbull', price: 'R$ 250,00' },
            { name: 'Jack Gentleman + 5 Redbull', price: 'R$ 245,00' },
            { name: 'Jack Daniel’s Mclaren + 5 Redbull', price: 'R$ 200,00' },
            { name: 'Jack Black Barry + 5 Redbull', price: 'R$ 290,00' },
            { name: 'Jack Barrel + 5 Redbull', price: 'R$ 330,00' },
            { name: 'Jim Beam + 5 Redbull', price: 'R$ 155,00' },
            { name: 'Woodford Reserve + 5 Redbull', price: 'R$ 260,00' },
            { name: 'Chivas 12 anos + 5 Redbull', price: 'R$ 205,00' },
            { name: 'Chivas 18 anos + 5 Redbull', price: 'R$ 415,00' },
            { name: 'Chanceller + Vibe 2L', price: 'R$ 50,00' },
            { name: 'Buchanan’s Deluxe + 5 Redbull', price: 'R$ 245,00' }
          ]
        },
        {
          title: 'Combos de Gin',
          note: 'Todos os combos acompanham 5 gelos e copos. Frutas: 5 pacotes por R$ 10,00.',
          keywords: 'combo gin',
          items: [
            { name: 'Tanqueray + 5 Redbull', price: 'R$ 190,00' },
            { name: 'Tanqueray Sevilla + 5 Redbull', price: 'R$ 215,00' },
            { name: 'Tanqueray Royale + 5 Redbull', price: 'R$ 230,00' },
            { name: 'Tanqueray Bossa Nova + 5 Redbull', price: 'R$ 230,00' },
            { name: 'Bombay + 5 Redbull', price: 'R$ 160,00' },
            { name: 'Beefeater Pink + 5 Redbull', price: 'R$ 195,00' },
            { name: 'Beefeater Limão + 5 Redbull', price: 'R$ 185,00' },
            { name: 'Beefeater Tradicional + 5 Redbull', price: 'R$ 180,00' },
            { name: 'Beefeater Blackberry + 5 Redbull', price: 'R$ 190,00' },
            { name: 'Gordon’s Pink + 5 Redbull', price: 'R$ 155,00' },
            { name: 'Gordon’s Tradicional + 5 Redbull', price: 'R$ 145,00' },
            { name: 'Eternity Royale + Baly 2L', price: 'R$ 55,00' },
            { name: 'Intenção + Baly 2L', price: 'R$ 50,00' },
            { name: 'Gin Rock’s + Baly 2L', price: 'R$ 70,00' },
            { name: 'Gin Rock’s + Redbull', price: 'R$ 105,00' }
          ]
        },
        {
          title: 'Combos de Vodka',
          note: 'Todos os combos acompanham 5 gelos e copos.',
          keywords: 'combo vodka',
          items: [
            { name: 'Askov + Vibe 2L', price: 'R$ 50,00' },
            { name: 'Askov + Baly 2L', price: 'R$ 50,00' },
            { name: 'Smirnoff + Vibe 2L', price: 'R$ 65,00' },
            { name: 'Smirnoff + 5 Redbull', price: 'R$ 100,00' },
            { name: 'Absolut + 5 Redbull', price: 'R$ 145,00' },
            { name: 'Absolut + Vibe 2L', price: 'R$ 110,00' },
            { name: 'Ciroc Red Berry + 5 Redbull', price: 'R$ 300,00' },
            { name: 'Grey Goose + 5 Redbull', price: 'R$ 220,00' },
            { name: 'Grey Goose Saborizado + 5 Redbull', price: 'R$ 230,00' },
            { name: 'Belvedere + 5 Redbull', price: 'R$ 205,00' }
          ]
        }
      ]
    },
    {
      id: 'bebidas',
      title: 'Bebidas',
      groups: [
        {
          title: 'Refrigerantes',
          keywords: 'refrigerante coca cola guarana fanta sprite',
          items: [
            { name: 'Coca-Cola', unit: '2L', price: 'R$ 13,00' },
            { name: 'Coca-Cola Retornável', price: 'R$ 9,00' },
            { name: 'Coca-Cola Zero', unit: '2L', price: 'R$ 13,00' },
            { name: 'Guaraná Antártica', unit: '2L', price: 'R$ 10,00' },
            { name: 'Fanta Uva', unit: '2L', price: 'R$ 10,00' },
            { name: 'Fanta Laranja', unit: '2L', price: 'R$ 10,00' },
            { name: 'Sprite', unit: '2L', price: 'R$ 10,00' },
            { name: 'Dolly', unit: '2L', price: 'R$ 7,00' },
            { name: 'Coca-Cola ou Fanta mini', price: 'R$ 3,00' },
            { name: 'Refrigerante lata', price: 'R$ 5,00' }
          ]
        },
        {
          title: 'Sucos e Águas',
          keywords: 'suco agua del valle gatorade',
          items: [
            { name: 'Suco Del Valle', unit: '1L', price: 'R$ 12,00' },
            { name: 'Suco lata', price: 'R$ 5,00' },
            { name: 'Água', unit: 'garrafa 510ml', price: 'R$ 3,00' },
            { name: 'Água', unit: 'garrafa 1,5L', price: 'R$ 5,00' },
            { name: 'Água com gás', unit: '510ml', price: 'R$ 3,00' },
            { name: 'Água de côco', unit: '1L', price: 'R$ 12,00' },
            { name: 'Água tônica lata', price: 'R$ 5,00' },
            { name: 'Gatorade', price: 'R$ 8,00' }
          ]
        },
        {
          title: 'Vinhos',
          keywords: 'vinho tinto branco',
          items: [
            { name: 'Pérgola', price: 'R$ 27,00' },
            { name: 'Bordô Caseiro', price: 'R$ 15,00' },
            { name: 'Santomé', price: 'R$ 22,00' },
            { name: 'Cantinho do Vale', unit: '880ml', price: 'R$ 6,00' },
            { name: 'Cantinho do Vale', unit: '2L', price: 'R$ 12,00' },
            { name: 'Draft', price: 'R$ 12,00' },
            { name: 'Catuaba Selvagem', price: 'R$ 18,00' },
            { name: 'Jurupinga', price: 'R$ 30,00' },
            { name: 'Groselha', price: 'R$ 20,00' }
          ]
        },
        {
          title: 'Cachaças',
          keywords: 'cachaça pinga',
          items: [
            { name: 'Corote', price: 'R$ 6,00' },
            { name: 'Pitu lata', unit: '350ml', price: 'R$ 7,00' },
            { name: 'Canelinha', price: 'R$ 15,00' },
            { name: '51', price: 'R$ 16,00' },
            { name: 'Velho Barreiro', price: 'R$ 16,00' },
            { name: 'Dreher', price: 'R$ 25,00' },
            { name: 'São Francisco', price: 'R$ 30,00' },
            { name: 'Tequiloka', price: 'R$ 35,00' },
            { name: 'Santo Mel', price: 'R$ 65,00' },
            { name: 'Campari', price: 'R$ 60,00' },
            { name: 'Aperol', price: 'R$ 60,00' },
            { name: 'José Cuervo', price: 'R$ 130,00' },
            { name: 'Montilla Ouro', price: 'R$ 40,00' },
            { name: 'Domecq', price: 'R$ 40,00' },
            { name: 'Kariri', price: 'R$ 22,00' }
          ]
        },
        {
          title: 'Licores',
          keywords: 'licor amarula',
          items: [
            { name: 'Licor 43 Crême Brûlée', price: 'R$ 190,00' },
            { name: 'Licor 43 Tradicional', price: 'R$ 145,00' },
            { name: 'Amarula', price: 'R$ 125,00' },
            { name: 'Licor Don Luiz', price: 'R$ 75,00' },
            { name: 'Licor 43 Chocolate', price: 'R$ 190,00' },
            { name: 'Licor Ballena', price: 'R$ 150,00' },
            { name: 'Licor Bem Casado', price: 'R$ 60,00' },
            { name: 'Licor Goly Whisky c/ Canela', price: 'R$ 130,00' },
            { name: 'Licor Goly Melancia c/ Hortelã', price: 'R$ 130,00' },
            { name: 'Combo Malibu c/ Baly', price: 'R$ 105,00' }
          ]
        },
        {
          title: 'Energéticos',
          note: 'Baly 2L nos sabores: melancia, tropical, maçã verde, morango com pêssego e côco com açaí.',
          keywords: 'energetico redbull vibe baly monster',
          items: [
            { name: 'Eternity Monster', price: 'R$ 12,00' },
            { name: 'Redbull Tradicional', price: 'R$ 12,00' },
            { name: 'Redbull Blueberry & Baunilha', price: 'R$ 12,00' },
            { name: 'Redbull Melancia', price: 'R$ 12,00' },
            { name: 'Redbull Tropical', price: 'R$ 12,00' },
            { name: 'Redbull Cereja', price: 'R$ 12,00' },
            { name: 'Redbull Frutas Vermelhas', price: 'R$ 12,00' },
            { name: 'Redbull Maracujá e Melão', price: 'R$ 12,00' },
            { name: 'Redbull Pomelo', price: 'R$ 12,00' },
            { name: 'Redbull Morango e Pêssego', price: 'R$ 12,00' },
            { name: 'Vibe Tradicional', unit: '2L', price: 'R$ 12,00' },
            { name: 'Baly de sabor', unit: '2L', price: 'R$ 15,00' }
          ]
        },
        {
          title: 'Champanhe',
          keywords: 'champanhe espumante chandon',
          items: [
            { name: 'Chandon Passion', price: 'R$ 95,00' },
            { name: 'Chandon Brut Rosé', price: 'R$ 90,00' },
            { name: 'Chandon Reserve Brut', price: 'R$ 90,00' },
            { name: 'Rosé Piscine', price: 'R$ 95,00' }
          ]
        }
      ]
    },
    {
      id: 'drinks',
      title: 'Drinks Prontos',
      groups: [
        {
          title: 'Drinks Prontos',
          keywords: 'drink pronto ice',
          items: [
            { name: 'GT Long Neck', price: 'R$ 8,00' },
            { name: 'Skol Beats Long Neck', price: 'R$ 8,00' },
            { name: 'Smirnoff Ice Long Neck', price: 'R$ 8,00' },
            { name: 'Cabaré Ice Frutas Vermelhas', price: 'R$ 8,00' },
            { name: 'Cabaré Ice Frutas Amarelas', price: 'R$ 8,00' },
            { name: 'Cabaré Ice Tangerina', price: 'R$ 8,00' },
            { name: 'Cabaré Ice Limão', price: 'R$ 8,00' },
            { name: 'Mansão Maromba', price: 'R$ 25,00' },
            { name: 'Busca Brisa', unit: '1L', price: 'R$ 45,00' },
            { name: 'Bob Pinga', price: 'R$ 25,00' }
          ]
        },
        {
          title: 'Gelos',
          keywords: 'gelo seco',
          items: [
            { name: 'Gelo de sabor', price: 'R$ 4,00' },
            { name: 'Gelo seco', unit: '5kg', price: 'R$ 10,00' }
          ]
        },
        {
          title: 'Carvão para Churrasco',
          keywords: 'carvao churrasco',
          items: [
            { name: 'Carvão', unit: '2kg', price: 'R$ 20,00' },
            { name: 'Carvão', unit: '3kg', price: 'R$ 25,00' }
          ]
        }
      ]
    },
    {
      id: 'tabacaria',
      title: 'Tabacaria',
      groups: [
        {
          title: 'Cigarros',
          note: 'Pagamento em cartão de crédito ou débito tem acréscimo de R$ 1,00.',
          keywords: 'cigarro tabacaria marlboro camel',
          items: [
            { name: 'Cigarro Eight', unit: 'und R$ 0,50', price: 'R$ 6,00' },
            { name: 'Cigarro Rothmans', unit: 'und R$ 1,00', price: 'R$ 9,00' },
            { name: 'Cigarro Rothmans Signature', unit: 'und R$ 1,00', price: 'R$ 11,00' },
            { name: 'Cigarro Calton', unit: 'und R$ 1,50', price: 'R$ 16,00' },
            { name: 'Cigarro Malboro Gold', unit: 'und R$ 1,50', price: 'R$ 16,00' },
            { name: 'Cigarro Malboro Red', unit: 'und R$ 1,50', price: 'R$ 16,00' },
            { name: 'Cigarro Malboro Tropical Fusion', unit: 'und R$ 2,00', price: 'R$ 18,00' },
            { name: 'Cigarro Malboro Forest Fusion', unit: 'und R$ 2,00', price: 'R$ 18,00' },
            { name: 'Cigarro Malboro Ice', unit: 'und R$ 2,00', price: 'R$ 18,00' },
            { name: 'Camel Blue', unit: 'und R$ 1,00', price: 'R$ 11,00' },
            { name: 'Camel Yellow', unit: 'und R$ 1,00', price: 'R$ 11,00' },
            { name: 'L&M Red', unit: 'und R$ 1,00', price: 'R$ 10,00' },
            { name: 'L&M Azul', unit: 'und R$ 1,00', price: 'R$ 10,00' },
            { name: 'L&M Prata', unit: 'und R$ 1,00', price: 'R$ 10,00' },
            { name: 'Chesterfield', unit: 'und R$ 1,50', price: 'R$ 14,00' }
          ]
        },
        {
          title: 'Acessórios',
          keywords: 'narguile essencia carvao seda',
          items: [
            { name: 'Essência Ziggy', price: 'R$ 12,00' },
            { name: 'Essência Adalya', price: 'R$ 25,00' },
            { name: 'Carvão de Coco', unit: 'meio kilo', price: 'R$ 25,00' },
            { name: 'Carvão de Coco', unit: '1kg', price: 'R$ 45,00' },
            { name: 'Alumínio', unit: 'caixa', price: 'R$ 16,00' },
            { name: 'Pegador', price: 'R$ 10,00' },
            { name: 'Forninho', price: 'R$ 35,00' },
            { name: 'Bic Pequeno', price: 'R$ 5,00' },
            { name: 'Bic Grande', price: 'R$ 7,00' },
            { name: 'Carvão avulso', price: 'R$ 1,50' },
            { name: 'Alumínio avulso', price: 'R$ 1,00' },
            { name: 'Tabaco Acrema ou Amsterdam', price: 'R$ 15,00' },
            { name: 'Seda Longa', price: 'R$ 6,00' },
            { name: 'Seda Normal', price: 'R$ 5,00' },
            { name: 'Seda Metro', price: 'R$ 6,00' },
            { name: 'Seda Longa Guru', price: 'R$ 4,00' },
            { name: 'Kit Sadhu Cuia e Tesoura', price: 'R$ 27,00' },
            { name: 'Tesoura Dubai', price: 'R$ 12,00' },
            { name: 'Piteira', price: 'R$ 6,00' }
          ]
        }
      ]
    }
  ]
};
