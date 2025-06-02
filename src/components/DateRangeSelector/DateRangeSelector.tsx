import React from "react";
import "./DateRangeSelector.css";

// Definindo os intervalos de data disponíveis com seus respectivos rótulos e valores
const dateRanges = [
  { label: "7 dias", value: "7d" },
  { label: "30 dias", value: "30d" },
  { label: "3 meses", value: "3m" },
  { label: "12 meses", value: "12m" },
  { label: "No Ano (YTD)", value: "ytd" },
  { label: "Máximo", value: "max" }, // Novo intervalo adicionado
];

// Tipagem das props que esse componente vai receber
interface DateRangeSelectorProps {
  selectedRange: string; // Intervalo de tempo atualmente selecionado
  onRangeChange: (range: string) => void; // Função que será chamada ao trocar de intervalo
}

// Componente funcional que recebe o intervalo selecionado e a função de troca como props
const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  selectedRange,
  onRangeChange,
}) => {
  return (
    <div className="date-range-selector">

      {/* Container que vai agrupar os botões dos intervalos */}
      <div className="date-range-options">
        {/* Mapeando os intervalos definidos pra gerar um botão pra cada um */}
        {dateRanges.map((range) => (
          <button
            key={range.value} // Valor único da opção, usado como key no React
            className={`range-button ${
              selectedRange === range.value ? "active" : ""
            }`} // Adiciona classe "active" se o botão estiver selecionado
            onClick={() => onRangeChange(range.value)} // Chama a função passando o valor do botão clicado
          >
            {range.label} {/* Mostra o texto do botão */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateRangeSelector;
