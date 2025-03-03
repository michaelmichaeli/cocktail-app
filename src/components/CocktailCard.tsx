import { Link } from "react-router-dom";
import { Trash2, Tags, Star } from "lucide-react";
import { AlcoholBadge } from "./ui/AlcoholBadge";
import { CategoryBadge } from "./ui/CategoryBadge";
import { GlassBadge } from "./ui/GlassBadge";
import type { CocktailCardProps } from "../types";
import DEFAULT_COCKTAIL_IMAGE from "../assets/default-cocktail.png";

export function CocktailCard({
	cocktail,
	onDelete,
	className = "",
}: CocktailCardProps) {
	const cardContent = (
		<div
			className={`card overflow-hidden bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}
		>
			{
				<figure className="relative">
					<img
						src={cocktail.imageUrl || DEFAULT_COCKTAIL_IMAGE}
						alt={`${cocktail.name} cocktail`}
						loading="lazy"
						className="aspect-[4/3] object-cover w-full transition-transform duration-300 group-hover:scale-105"
					/>
				</figure>
			}
			<div className="card-body p-0">
				<div className="p-6 pb-2">
					<h3 className="card-title">{cocktail.name}</h3>
					<div className="flex flex-wrap gap-2 mt-2">
						{cocktail.isCustom && (
							<span className="badge badge-warning badge-sm gap-1">
								<Star className="h-3 w-3" />
								Custom
							</span>
						)}
						{cocktail.alcoholicType && (
							<AlcoholBadge type={cocktail.alcoholicType} size="sm" />
						)}
						{cocktail.category && (
							<CategoryBadge category={cocktail.category} size="sm" noLink />
						)}
						{cocktail.glass && (
							<GlassBadge glass={cocktail.glass} size="sm" noLink />
						)}
						{cocktail.tags?.map((tag, index) => (
							<span key={index} className="badge badge-ghost badge-sm gap-1">
								<Tags className="h-3 w-3" />
								{tag}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="relative group">
			<Link to={`/recipe/${cocktail.id}`}>{cardContent}</Link>
			{cocktail.isCustom && onDelete && (
				<button
					className="delete-btn btn btn-error btn-sm gap-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onDelete(cocktail.id);
					}}
				>
					<Trash2 className="h-4 w-4" />
					Delete
				</button>
			)}
		</div>
	);
}
