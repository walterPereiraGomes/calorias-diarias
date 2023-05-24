import logo from "./logo.svg";
import "./App.css";
import {
  Autocomplete,
  Button,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getNutrition } from "./axios";
import { ModalAlimentos } from "./ModalAlimentos";

const PorcentagemGeral = ({nome, geral, valor}) => {
  return (
    <> 
      <span>{nome}:{" "}</span>
      { geral ? (
        <span>
          {(
            (valor * 100) /
            geral
          ).toFixed(2)}
          %
        </span>
      ) : (<span>-</span>)}
    </>
  )
}

function App() {
  const [refeicoes, setRefeicoes] = useState([]);
  const [openModalAlimentos, setOpenModalAlimentos] = useState(false);
  const [resultadoGeral, setResultadoGeral] = useState(false);
  const [load, setLoad] = useState(false);

  const montaQuery = (items) => {
    return items
      .map((item) => `${item.quantidade}%20${item.nome.replaceAll(" ", "%20")}`)
      .join("%20and%20");
  };

  const calcular = async () => {
    if(!refeicoes.length) {
      alert('Adicione alimentos!')
    }
    setLoad(true)
    const queries = refeicoes.map((refeicao) => {
      return montaQuery(refeicao.items);
    });

    const promises = queries.map((query) => {
      return getNutrition(query).then((r) => r);
    });
    Promise.all(promises).then((results) => {
      const refeicoesCopia = [...refeicoes];
      results.forEach((result, index) => {
        const refeicaoCopia = refeicoesCopia[index];
        let obj = {
          calorias: 0,
          proteinas: 0,
          carboidratos: 0,
          fibras: 0,
          gorduras: 0
        };
        result.data.items.forEach((item) => {
          obj.proteinas += item.protein_g;
          obj.calorias += item.calories;
          obj.carboidratos += item.carbohydrates_total_g;
          obj.fibras += item.fiber_g;
          obj.gorduras += item.fat_total_g;
        });
        refeicaoCopia.resultado = obj;
        refeicoesCopia[index] = refeicaoCopia;
      });
      let objGeral = {
        calorias: 0,
        proteinas: 0,
        carboidratos: 0,
        fibras: 0,
        gorduras: 0,
      };
      refeicoesCopia.forEach((r) => {
        objGeral.proteinas += r.resultado.proteinas;
        objGeral.calorias += r.resultado.calorias;
        objGeral.carboidratos += r.resultado.carboidratos;
        objGeral.fibras += r.resultado.fibras;
        objGeral.gorduras += r.resultado.gorduras;
      });
      setRefeicoes(refeicoesCopia);
      setResultadoGeral(objGeral);
      setLoad(false)
    });
  };

  useEffect(() => {
    console.log("refeicoes :>> ", refeicoes);
  }, [refeicoes]);

  const salvarRefeicao = (novaRefeicao) => {
    setRefeicoes((prev) => [...prev, novaRefeicao]);
    setOpenModalAlimentos(false);
  };

  return (
    <div
      className="App"
      style={{
        minWidth: 300,
        paddingInline: 20,
        paddingTop: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#577D86",
        minHeight: "100vh",
        paddingBottom: 30
      }}
    >
      <ModalAlimentos
        visible={openModalAlimentos}
        salvarRefeicao={salvarRefeicao}
        cancelarRefeicao={() => setOpenModalAlimentos(false)}
      />
      <span
        style={{
          fontWeight: "bold",
          fontSize: 25,
          marginBottom: 50,
          color: "#CBEDD5",
        }}
      >
        Cálculo de calorias
      </span>
      <div style={{ marginBottom: 50 }}>
        <Button
          onClick={() => setOpenModalAlimentos(true)}
          variant="contained"
          style={{ backgroundColor: "#569DAA", color: "#CBEDD5", width: '30%' }}
        >
          Adicionar Refeição
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#569DAA",
            marginLeft: 5,
            color: "#CBEDD5",
            width: '30%'
          }}
          onClick={calcular}
        >
          Calcular Calorias
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
        }}
      >
        {refeicoes.map((refeicao) => (
          <div
            style={{
              minWidth: 300,
              width: "100%",
              maxWidth: 800,
              backgroundColor: "#62B6B7",
              borderRadius: 20,
              paddingTop: 20,
              paddingBottom: 20,
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 20 }}>{refeicao.nome}</span>
            {refeicao.items.map((item) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingInline: 40,
                  marginTop: 10,
                }}
              >
                <span>{item.nomeTraduzido}</span>
                <div>
                  <span>{item.quantidade}</span>
                </div>
              </div>
            ))}
            {!!refeicao.resultado && (
              <div
                style={{
                  marginInline: 40,
                  backgroundColor: "#CBEDD5",
                  paddingBottom: 10,
                  paddingTop: 10,
                  marginTop: 30,
                  borderRadius: 20,
                }}
              >
                <span style={{ fontSize: 20 }}>Resultado</span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: 'column',
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: 10}}>
                    <div style={{ display: "flex", flexDirection: "column", width: 150, alignItems: 'center' }}>
                      <span>Proteína:</span>
                      <span>{parseInt(refeicao.resultado.proteinas)} g</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", width: 150, alignItems: 'center' }}>
                      <span>Carboidratos:</span>
                      <span>{parseInt(refeicao.resultado.carboidratos)} g </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: 10, width: '100%'}}>
                    <div style={{ display: "flex", flexDirection: "column", width: 150, alignItems: 'center' }}>
                      <span>Calorias:</span>
                      <span>{parseInt(refeicao.resultado.calorias)} kcal</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", width: 150, alignItems: 'center' }}>
                      <span>Fibras:</span>
                      <span>{parseInt(refeicao.resultado.fibras)} g</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: 10}}>
                  <div style={{ display: "flex", flexDirection: "column", width: 150, alignItems: 'center' }}>
                    <span>Gorduras:</span>
                    <span>{parseInt(refeicao.resultado.gorduras)} g</span>
                  </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {load ? (
        <CircularProgress style={{ color: "#CBEDD5" }} size={50}/>
      ) : resultadoGeral && (
        <div style={{ width: "100%" }}>
          <h2 style={{ color: "#CBEDD5" }}>Resumo Diário</h2>
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
                flexDirection: 'column',
                borderRadius: 20,
                width: "100%",
                maxWidth: 800,
                backgroundColor: "#62B6B7",
                minWidth: 300,
                paddingTop: 20,
                paddingBottom: 20,
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-evenly', marginBottom: 20}}>
                <div style={{ display: "flex", flexDirection: "column", backgroundColor: '#CBEDD5', padding: 40, borderRadius: 20, width: '25%' }}>
                  <strong>Total de Proteínas:</strong>
                  <span style={{ marginBottom: 20 }}>
                    {resultadoGeral.proteinas.toFixed(2)} g
                  </span>
                  {refeicoes.map((refeicao) => (
                    <>
                    {refeicao.resultado && (
                      <PorcentagemGeral nome={refeicao.nome} geral={resultadoGeral?.proteinas} valor={refeicao.resultado?.proteinas} />
                    )}
                    </>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", backgroundColor: '#CBEDD5', padding: 40, borderRadius: 20, width: '25%'}}>
                  <strong>Total de Carboidratos:</strong>
                  <span style={{ marginBottom: 20 }}>
                    {resultadoGeral.carboidratos.toFixed(2)} g{" "}
                  </span>
                  {refeicoes.map((refeicao) => (
                    <>
                    {refeicao.resultado && (
                      <PorcentagemGeral nome={refeicao.nome} geral={resultadoGeral?.carboidratos} valor={refeicao.resultado?.carboidratos} />
                    )}
                    </>
                  ))}
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-evenly', marginBottom: 20}}>
                <div style={{ display: "flex", flexDirection: "column", backgroundColor: '#CBEDD5', padding: 40, borderRadius: 20, width: '25%'}}>
                  <strong>Total de Calorias:</strong>
                  <span style={{ marginBottom: 20 }}>
                    {resultadoGeral.calorias.toFixed(2)} kcal
                  </span>
                  {refeicoes.map((refeicao) => (
                    <>
                    { refeicao.resultado && (
                      <PorcentagemGeral nome={refeicao.nome} geral={resultadoGeral?.calorias} valor={refeicao.resultado?.calorias} />
                    )}
                    </>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", backgroundColor: '#CBEDD5', padding: 40, borderRadius: 20, width: '25%' }}>
                  <strong>Total de Fibras:</strong>
                  <span style={{ marginBottom: 20 }}>
                    {resultadoGeral.fibras.toFixed(2)} g
                  </span>
                  {refeicoes.map((refeicao) => (
                    <PorcentagemGeral nome={refeicao.nome} geral={resultadoGeral?.fibras} valor={refeicao.resultado?.fibras} />
                  ))}
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-evenly', marginBottom: 20}}>
                <div style={{ display: "flex", flexDirection: "column", backgroundColor: '#CBEDD5', padding: 40, borderRadius: 20, width: '25%' }}>
                  <strong>Total de Gorduras:</strong>
                  <span style={{ marginBottom: 20 }}>
                    {resultadoGeral.gorduras.toFixed(2)} g
                  </span>
                  {refeicoes.map((refeicao) => (
                    <>
                    { refeicao.resultado && (
                      <PorcentagemGeral nome={refeicao.nome} geral={resultadoGeral?.gorduras} valor={refeicao.resultado?.gorduras} />
                    )}
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
