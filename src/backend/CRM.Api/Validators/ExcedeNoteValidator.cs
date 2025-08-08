using CRM.Domain.Models.Integrations;
using FluentValidation;

namespace CRM.WebApi.Validators
{
    public class ExcedeNoteValidator : AbstractValidator<ExcedeNote>
    {
        public ExcedeNoteValidator()
        {
            RuleFor(x => x.Id).NotNull().NotEmpty();
            RuleFor(x => x.Des).NotNull().NotEmpty();
            RuleFor(x => x.Des).Length(1, 200);
        }
    }
}
