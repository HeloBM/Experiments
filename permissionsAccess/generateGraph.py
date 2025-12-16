import matplotlib.pyplot as plt
import argparse
import csv

def main():
    parse = argparse.ArgumentParser()
    parse.add_argument('--csv', help="CSV file to generate graph from", required=True)
    parse.add_argument('--n', help="Exeperiment ran N times", required=True)

    args = parse.parse_args()
    
    x_values = []
    y_values = []

    with open(args.csv, 'r', encoding='utf-8') as file:
        csv_reader = csv.reader(file, delimiter=',')
        next(csv_reader)

        for row in csv_reader:
            x_values.append(row[0])
            y_values.append(float(row[1]))

    plt.bar(x_values, y_values)
    plt.xlabel('Strategy')
    plt.xticks(rotation=45, ha='right')
    plt.ylabel('Execution Time (ms)')
    plt.title(f'Mean Time for {args.n} Executions')

    plt.set_axisbelow(True)
    plt.grid(axis='y', alpha=0.5)
    plt.tight_layout()
    plt.savefig(f'plots/execution_time_{args.n}.png')


if __name__=="__main__":
    main()