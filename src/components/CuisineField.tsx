import { getCuisines } from "@/app/action";
import { FormSchema, ItemType } from "@/components/form/AddRestaurantForm";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";
import { UseFormReturn } from "react-hook-form";

export function CuisineField({ form }: { form: UseFormReturn<FormSchema> }) {
	const [cuisines, setCuisines] = React.useState<ItemType[]>([]);

	React.useEffect(() => {
		const fetchAll = async () => {
			await getCuisines().then(data => setCuisines(data));
		};

		fetchAll();
	}, []);
	return (
		<FormField
			control={form.control}
			name="cuisines"
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>Cuisines</FormLabel>
					<Popover>
						<PopoverTrigger asChild>
							<FormControl>
							<Button
									variant="outline"
									role="combobox"
									className={cn(
										"justify-between",
										!field.value && "text-muted-foreground"
									)}>
									{field.value && field.value.length > 0
										? field.value
												.map(
													selectedValue =>
														cuisines.find(cuisine => cuisine.id === selectedValue)?.name
												)
												.filter(Boolean)
												.join(", ")
										: "Select Cuisines"}
									<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="p-0">
							<Command>
								<CommandInput placeholder="Search cuisines..." />
								<CommandEmpty>No cuisines found.</CommandEmpty>
								<CommandGroup>
									{cuisines.map(cuisine => (
										<CommandItem
											value={cuisine.name}
											key={cuisine.id}
											onSelect={() => {
												const currentValues = form.getValues("cuisines") || [];
												const isSelected = currentValues.includes(cuisine.id);

												if (isSelected) {
													const updatedValues = currentValues.filter(
														val => val !== cuisine.id
													);
													form.setValue("cuisines", updatedValues);
												} else {
													form.setValue("cuisines", [...currentValues, cuisine.id]);
												}
											}}>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													field.value?.includes(cuisine.id)
														? "opacity-100"
														: "opacity-0"
												)}
											/>
											{cuisine.name}
										</CommandItem>
									))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
				</FormItem>
			)}
		/>
	);
}
