CREATE TABLE Usuarios (
      id SERIAL PRIMARY KEY,
      login VARCHAR(100) NOT NULL,
      senha VARCHAR(100) NOT NULL ,
      sexo CHAR NOT NULL
);
