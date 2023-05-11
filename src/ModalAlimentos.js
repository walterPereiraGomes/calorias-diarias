import React, { useState } from "react";
import { Autocomplete, Button, Modal, TextField } from "@mui/material";

export const ModalAlimentos = ({
  visible,
  salvarRefeicao,
  cancelarRefeicao,
}) => {
  const alimentos = [
    {
      label: "Peito de frango",
      value: "chicken breast",
      unidadeMedida: "g",
    },
    {
      label: "Arroz",
      value: "rice",
      unidadeMedida: "g",
    },
    {
      label: "Feijão",
      value: "bean",
      unidadeMedida: "g",
    },
    {
      label: "Ovo",
      value: "egg",
      unidadeMedida: "unidade",
    },
    {
      label: "Pão",
      value: "bread",
      unidadeMedida: "unidade",
    },
    {
      label: "Batara",
      value: "potato",
      unidadeMedida: "g",
    },
  ];
  const alimentoVazio = { nome: "", quantidade: "" };
  const [alimentosSelecionados, setAlimentosSelecionados] = useState([
    alimentoVazio,
  ]);
  const [nomeRefeicao, setNomeRefeicao] = useState("");
  return (
    <Modal
      open={visible}
      style={{ width: "100%", display: "flex", justifyContent: "center" }}
    >
      <div
        style={{
          backgroundColor: "#CBEDD5",
          width: "60%",
          maxHeight: 500,
          marginTop: 50,
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ overflow: "auto" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h3>Nova Refeição</h3>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "60%",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Digite o nome da refeição"
                variant="outlined"
                style={{ width: "100%" }}
                value={nomeRefeicao}
                onChange={(event) => {
                  setNomeRefeicao(event.target.value);
                }}
              />
            </div>
          </div>
          {alimentosSelecionados.map((refeicao, index) => (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  borderRadius: 10,
                  width: "60%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Autocomplete
                  style={{ marginRight: 10 }}
                  disablePortal
                  id="combo-box-demo"
                  options={alimentos}
                  sx={{ width: "50%" }}
                  onChange={(event, alimento) => {
                    const alimentosSelecionadosCopia = [
                      ...alimentosSelecionados,
                    ];
                    alimentosSelecionadosCopia[index].nome = alimento.value;
                    alimentosSelecionadosCopia[index].nomeTraduzido =
                      alimento.label;
                    setAlimentosSelecionados(alimentosSelecionadosCopia);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Selecione o alimento" />
                  )}
                />
                <TextField
                  id="outlined-basic"
                  label="Quantidade"
                  variant="outlined"
                  style={{ width: "50%" }}
                  value={refeicao.quantidade}
                  onChange={(event) => {
                    const alimentosSelecionadosCopia = [
                      ...alimentosSelecionados,
                    ];
                    alimentosSelecionadosCopia[index].quantidade =
                      event.target.value;
                    setAlimentosSelecionados(alimentosSelecionadosCopia);
                  }}
                />
              </div>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 20,
              marginTop: 20,
            }}
          >
            <Button
              style={{ backgroundColor: "#569DAA", color: "#CBEDD5" }}
              onClick={() =>
                setAlimentosSelecionados([
                  ...alimentosSelecionados,
                  alimentoVazio,
                ])
              }
            >
              +
            </Button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginInline: 40,
            paddingTop: 20,
            paddingBottom: 20,
            borderTop: "solid 1px grey",
          }}
        >
          <Button
            onClick={() => {
              setAlimentosSelecionados([]);
              cancelarRefeicao();
            }}
            style={{ backgroundColor: "#569DAA", color: "#CBEDD5" }}
          >
            Cancelar
          </Button>
          <Button
            style={{ backgroundColor: "#569DAA", color: "#CBEDD5" }}
            onClick={() => {
              salvarRefeicao({
                nome: nomeRefeicao,
                items: alimentosSelecionados,
              });
              setNomeRefeicao("");
              setAlimentosSelecionados([]);
            }}
          >
            Salvar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
